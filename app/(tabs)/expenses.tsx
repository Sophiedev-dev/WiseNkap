import { getAuth } from "firebase/auth";
import {
    addDoc,
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    where,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "../../src/firebase";

const CATEGORIES = [
  { name: "Loyer", icon: "🏠", color: "#22C55E" },
  { name: "Nourriture", icon: "🍔", color: "#22C55E" },
  { name: "Boisson", icon: "🥤", color: "#22C55E" },
  { name: "Habit", icon: "👕", color: "#22C55E" },
  { name: "Transport", icon: "🚗", color: "#22C55E" },
  { name: "Connexion", icon: "🌐", color: "#22C55E" },
  { name: "Autres", icon: "•••", color: "#22C55E" },
];

type Expense = {
  id: string;
  amount: number;
  category: string;
  label?: string;
  date: any;
  userId: string;
};

export default function ExpensesScreen() {
  const user = getAuth().currentUser;

  const [budget, setBudget] = useState<number | null>(null);
  const [budgetInput, setBudgetInput] = useState("");

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [label, setLabel] = useState("");

  /* 🔹 CHARGER BUDGET + DÉPENSES EN TEMPS RÉEL */
  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const unsubscribeBudget = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        setBudget(snap.data().budget ?? null);
      }
    });

    const expensesQuery = query(
      collection(db, "expenses"),
      where("userId", "==", user.uid),
      orderBy("date", "desc")
    );

    const unsubscribeExpenses = onSnapshot(expensesQuery, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Expense[];
      setExpenses(list);
    });

    return () => {
      unsubscribeBudget();
      unsubscribeExpenses();
    };
  }, [user]);

  /* 🔹 CALCULS */
  const totalExpenses = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const remainingBudget = budget !== null ? budget - totalExpenses : null;

  /* 🔹 SAUVEGARDER LE BUDGET */
  const saveBudget = async () => {
    if (!user || !budgetInput) return;

    const value = Number(budgetInput);
    if (isNaN(value)) {
      Alert.alert("Erreur", "Budget invalide");
      return;
    }

    await setDoc(doc(db, "users", user.uid), { budget: value }, { merge: true });
    setBudgetInput("");
  };

  /* 🔹 AJOUTER UNE DÉPENSE */
  const addExpense = async () => {
    if (!user || !amount || !category) {
      Alert.alert("Erreur", "Champs manquants");
      return;
    }

    const value = Number(amount);
    if (isNaN(value)) {
      Alert.alert("Erreur", "Montant invalide");
      return;
    }

    await addDoc(collection(db, "expenses"), {
      amount: value,
      category,
      label: category === "Autres" ? label : "",
      date: serverTimestamp(),
      userId: user.uid,
    });

    setAmount("");
    setLabel("");
    setCategory(null);
  };

  /* 🔹 UI */
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
      {/* HEADER */}
      <View style={{ backgroundColor: "#FFF", paddingTop: 20, paddingBottom: 20, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#1F2937" }}>DashBoard</Text>
      </View>

      {/* CARDS RÉSUMÉ */}
      <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
        <View style={{ flexDirection: "row", gap: 12 }}>
          {/* Budget Card */}
          <View
            style={{
              flex: 1,
              backgroundColor: "#22C55E",
              borderRadius: 16,
              padding: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 14, color: "#FFF", opacity: 0.9, marginBottom: 12 }}>
              BUDGET RESTART
            </Text>
            <Text style={{ fontSize: 28, fontWeight: "bold", color: "#FFF" }}>
              {budget ?? "—"}
            </Text>
            <Text style={{ fontSize: 12, color: "#FFF", opacity: 0.8, marginTop: 8 }}>FCFA</Text>
          </View>

          {/* Total Dépenses Card */}
          <View
            style={{
              flex: 1,
              backgroundColor: "#2563EB",
              borderRadius: 16,
              padding: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 14, color: "#FFF", opacity: 0.9, marginBottom: 12 }}>
              TOTAL DÉDÉPENSES
            </Text>
            <Text style={{ fontSize: 28, fontWeight: "bold", color: "#FFF" }}>
              {totalExpenses.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Budget restant */}
        {remainingBudget !== null && (
          <View style={{ marginTop: 12 }}>
            <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Budget restant</Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: remainingBudget < 0 ? "#EF4444" : "#22C55E",
              }}
            >
              {remainingBudget.toFixed(2)} FCFA
            </Text>
          </View>
        )}
      </View>

      {/* DÉFINIR BUDGET */}
      <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#1F2937", marginBottom: 12 }}>
          Définir votre budget
        </Text>

        <TextInput
          placeholder="Montant du budget (FCFA)"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={budgetInput}
          onChangeText={setBudgetInput}
          style={{
            borderWidth: 1.5,
            borderColor: "#2563EB",
            borderRadius: 12,
            padding: 14,
            marginBottom: 12,
            fontSize: 14,
            color: "#1F2937",
          }}
        />

        {/* <TextInput
          placeholder="Montant (€)"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          style={{
            borderWidth: 1.5,
            borderColor: "#2563EB",
            borderRadius: 12,
            padding: 14,
            marginBottom: 16,
            fontSize: 14,
            color: "#1F2937",
          }}
        /> */}

        <TouchableOpacity
          onPress={saveBudget}
          style={{
            backgroundColor: "#2563EB",
            borderRadius: 12,
            padding: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#FFF", fontWeight: "600", fontSize: 16 }}>
            ENREGISTRER LE BUDGET
          </Text>
        </TouchableOpacity>
      </View>

      {/* AJOUTER DÉPENSE */}
      <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#1F2937", marginBottom: 12 }}>
          Ajouter une dépense
        </Text>

        <TextInput
          placeholder="Montant"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={{
            borderWidth: 1.5,
            borderColor: "#2563EB",
            borderRadius: 12,
            padding: 14,
            marginBottom: 16,
            fontSize: 14,
            color: "#1F2937",
          }}
        />

        {/* Categories Grid */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.name}
              onPress={() => setCategory(cat.name)}
              style={{
                flex: 1,
                minWidth: "47%",
                backgroundColor: category === cat.name ? cat.color : "#E5E7EB",
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 8,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20, marginBottom: 4 }}>{cat.icon}</Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: category === cat.name ? "#FFF" : "#6B7280",
                  textAlign: "center",
                }}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {category === "Autres" && (
          <TextInput
            placeholder="Nom de la dépense"
            placeholderTextColor="#9CA3AF"
            value={label}
            onChangeText={setLabel}
            style={{
              borderWidth: 1.5,
              borderColor: "#2563EB",
              borderRadius: 12,
              padding: 14,
              marginBottom: 16,
              fontSize: 14,
              color: "#1F2937",
            }}
          />
        )}

        <TouchableOpacity
          onPress={addExpense}
          style={{
            backgroundColor: "#2563EB",
            borderRadius: 12,
            padding: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#FFF", fontWeight: "600", fontSize: 16 }}>AJOUTER</Text>
        </TouchableOpacity>
      </View>

      {/* DÉPENSES RÉCENTES */}
      <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#1F2937", marginBottom: 12 }}>
          Dépenses récentes
        </Text>

        <FlatList
          scrollEnabled={false}
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "#FFF",
                borderRadius: 12,
                padding: 14,
                marginBottom: 8,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderLeftWidth: 4,
                borderLeftColor: "#22C55E",
              }}
            >
              <Text style={{ fontSize: 14, color: "#1F2937", fontWeight: "500", flex: 1 }}>
                {item.category} {item.label ? `(${item.label})` : ""}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#2563EB" }}>
                {item.amount.toFixed(2)}
              </Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
}
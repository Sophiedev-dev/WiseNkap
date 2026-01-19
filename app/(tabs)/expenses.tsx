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
import { getAuth, onAuthStateChanged, User, signOut } from "firebase/auth";
import { useRouter } from "expo-router";

const CATEGORIES = [
  { name: "Loyer", icon: "🏠", color: "#3B82F6" },
  { name: "Nourriture", icon: "🍔", color: "#10B981" },
  { name: "Boisson", icon: "🥤", color: "#F59E0B" },
  { name: "Habit", icon: "👕", color: "#8B5CF6" },
  { name: "Transport", icon: "🚗", color: "#EF4444" },
  { name: "Connexion", icon: "🌐", color: "#06B6D4" },
  { name: "Autres", icon: "•••", color: "#6B7280" },
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
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [budget, setBudget] = useState<number | null>(null);
  const [budgetInput, setBudgetInput] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setBudget(null);
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const unsubscribeBudget = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        setBudget(snap.data().budget ?? null);
      } else {
        setBudget(null);
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

  const logout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setExpenses([]);
      setBudget(null);
      router.replace("/auth/login");
    } catch (e) {
      Alert.alert("Erreur", "Impossible de se déconnecter");
    }
  };

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  );

  const remainingBudget = budget !== null ? budget - totalExpenses : null;

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

  const getCategoryIcon = (categoryName: string) => {
    return CATEGORIES.find((c) => c.name === categoryName)?.icon || "💰";
  };

  const getCategoryColor = (categoryName: string) => {
    return CATEGORIES.find((c) => c.name === categoryName)?.color || "#6B7280";
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      {/* HEADER */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingTop: 60,
          paddingBottom: 24,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={{ fontSize: 16, color: "#6B7280", marginBottom: 4 }}>Bonjour,</Text>
            <Text style={{ fontSize: 28, fontWeight: "700", color: "#1F2937" }}>
              {user?.displayName || "Utilisateur"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={logout}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: "#F3F4F6",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20 }}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CARD BUDGET PRINCIPAL (style Mandiri) */}
      <View style={{ paddingHorizontal: 20, marginTop: -30, marginBottom: 24 }}>
        <View
          style={{
            backgroundColor: "#2563EB",
            borderRadius: 20,
            padding: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#FFFFFF" }}>Budget Manager</Text>
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#FFFFFF" }}>💳</Text>
          </View>

          <Text style={{ fontSize: 14, color: "#BFDBFE", marginBottom: 8 }}>Balance</Text>
          <Text style={{ fontSize: 42, fontWeight: "700", color: "#FFFFFF", marginBottom: 4 }}>
            ${remainingBudget !== null ? remainingBudget.toFixed(2) : "0.00"}
          </Text>
          <Text style={{ fontSize: 12, color: "#BFDBFE" }}>FCFA disponible</Text>
        </View>
      </View>

      {/* SPENDING & INCOME */}
      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "#FEE2E2",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 24 }}>↑</Text>
            </View>
            <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Dépenses</Text>
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#1F2937" }}>
              ${totalExpenses.toFixed(2)}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "#D1FAE5",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 24 }}>↓</Text>
            </View>
            <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Budget</Text>
            <Text style={{ fontSize: 24, fontWeight: "700", color: "#1F2937" }}>
              ${budget !== null ? budget.toFixed(2) : "0.00"}
            </Text>
          </View>
        </View>
      </View>

      {/* DÉFINIR BUDGET */}
      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#1F2937", marginBottom: 16 }}>
            Définir votre budget
          </Text>

          <TextInput
            placeholder="Montant du budget (FCFA)"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={budgetInput}
            onChangeText={setBudgetInput}
            style={{
              backgroundColor: "#F9FAFB",
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              fontSize: 16,
              color: "#1F2937",
            }}
          />

          <TouchableOpacity
            onPress={saveBudget}
            style={{
              backgroundColor: "#2563EB",
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 16 }}>
              Enregistrer
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* AJOUTER DÉPENSE */}
      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#1F2937", marginBottom: 16 }}>
            Ajouter une dépense
          </Text>

          <TextInput
            placeholder="Montant"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={{
              backgroundColor: "#F9FAFB",
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
              fontSize: 16,
              color: "#1F2937",
            }}
          />

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.name}
                onPress={() => setCategory(cat.name)}
                style={{
                  minWidth: "30%",
                  backgroundColor: category === cat.name ? cat.color : "#F3F4F6",
                  borderRadius: 12,
                  paddingVertical: 14,
                  paddingHorizontal: 12,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 24, marginBottom: 4 }}>{cat.icon}</Text>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "600",
                    color: category === cat.name ? "#FFFFFF" : "#6B7280",
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
                backgroundColor: "#F9FAFB",
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                fontSize: 16,
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
            <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 16 }}>Ajouter</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* TRANSACTIONS */}
      <View style={{ paddingHorizontal: 20, marginBottom: 40 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#1F2937" }}>Transactions</Text>
          <TouchableOpacity>
            <Text style={{ fontSize: 14, color: "#2563EB", fontWeight: "600" }}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        <View style={{ gap: 12 }}>
          {expenses.map((item) => (
            <View
              key={item.id}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  backgroundColor: getCategoryColor(item.category) + "20",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 16,
                }}
              >
                <Text style={{ fontSize: 24 }}>{getCategoryIcon(item.category)}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: "600", color: "#1F2937", marginBottom: 2 }}>
                  {item.category}
                </Text>
                {item.label && (
                  <Text style={{ fontSize: 13, color: "#6B7280" }}>{item.label}</Text>
                )}
                <Text style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                  {item.date?.toDate ? new Date(item.date.toDate()).toLocaleDateString() : "Aujourd'hui"}
                </Text>
              </View>

              <Text style={{ fontSize: 18, fontWeight: "700", color: "#EF4444" }}>
                -${item.amount.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
import { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Animated,
  PanResponder,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
} from "react-native";

// ─── 1. Pressable with all events ────────────────────────────────────────────

function PressableDemo() {
  return (
    <Pressable
      style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
      onPress={() => console.log("press")}
      onLongPress={() => console.log("long press")}
      onPressIn={() => console.log("finger down")}
      onPressOut={() => console.log("finger up")}
      delayLongPress={500}
      hitSlop={10}
    >
      {({ pressed }) => (
        <Text style={[styles.btnLabel, pressed && styles.btnLabelPressed]}>
          {pressed ? "Holding..." : "Press me"}
        </Text>
      )}
    </Pressable>
  );
}

// ─── 2. TouchableOpacity ─────────────────────────────────────────────────────

function TouchableOpacityDemo() {
  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={() => console.log("pressed")}
      activeOpacity={0.7}
    >
      <Text style={styles.btnLabel}>TouchableOpacity</Text>
    </TouchableOpacity>
  );
}

// ─── 3. Swipe to delete ───────────────────────────────────────────────────────

function SwipeableItem({
  title,
  onDelete,
}: {
  title: string;
  onDelete: () => void;
}) {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,

      onPanResponderMove: (_, gesture) => {
        if (gesture.dx < 0) {
          translateX.setValue(gesture.dx);
        }
      },

      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -80) {
          Animated.timing(translateX, {
            toValue: -400,
            duration: 200,
            useNativeDriver: true,
          }).start(onDelete);
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <View style={styles.swipeRow}>
      <View style={styles.deleteBtn}>
        <Text style={styles.deleteTxt}>Delete</Text>
      </View>
      <Animated.View
        style={[styles.swipeItem, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <Text style={styles.swipeTitle}>{title}</Text>
      </Animated.View>
    </View>
  );
}

function SwipeDemo() {
  const [items, setItems] = useState([
    { id: "1", title: "Swipe me left" },
    { id: "2", title: "Try swiping this one too" },
    { id: "3", title: "And this one" },
  ]);

  return (
    <View>
      {items.map((item) => (
        <SwipeableItem
          key={item.id}
          title={item.title}
          onDelete={() =>
            setItems((prev) => prev.filter((i) => i.id !== item.id))
          }
        />
      ))}
    </View>
  );
}

// ─── 4. Animated.timing — fade in ────────────────────────────────────────────

function FadeInDemo() {
  const opacity = useRef(new Animated.Value(0)).current;

  const show = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const hide = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.row}>
      <Pressable style={styles.btn} onPress={show}>
        <Text style={styles.btnLabel}>Show</Text>
      </Pressable>
      <Pressable style={[styles.btn, styles.btnOutline]} onPress={hide}>
        <Text style={[styles.btnLabel, styles.btnLabelOutline]}>Hide</Text>
      </Pressable>
      <Animated.View style={[styles.fadeBox, { opacity }]}>
        <Text style={styles.btnLabel}>I faded in!</Text>
      </Animated.View>
    </View>
  );
}

// ─── 5. Animated.spring — bounce ─────────────────────────────────────────────

function BounceDemo() {
  const scale = useRef(new Animated.Value(1)).current;

  const bounce = () => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.2,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable style={styles.btn} onPress={bounce}>
        <Text style={styles.btnLabel}>Bounce me</Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── 6. Animated sequence + parallel ─────────────────────────────────────────

function SequenceDemo() {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  const run = () => {
    opacity.setValue(0);
    translateY.setValue(30);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View>
      <Pressable style={styles.btn} onPress={run}>
        <Text style={styles.btnLabel}>Animate in</Text>
      </Pressable>
      <Animated.View
        style={[styles.fadeBox, { opacity, transform: [{ translateY }] }]}
      >
        <Text style={styles.btnLabel}>Slid in!</Text>
      </Animated.View>
    </View>
  );
}

// ─── 7. Keyboard dismiss ──────────────────────────────────────────────────────

import { TextInput } from "react-native";

function KeyboardDemo() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.keyboardArea}>
        <TextInput
          style={styles.input}
          placeholder="Tap outside to dismiss keyboard"
          placeholderTextColor="#999"
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

// ─── 8. hitSlop icon toolbar ──────────────────────────────────────────────────

function IconButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      hitSlop={12}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconBtn,
        pressed && styles.iconBtnPressed,
      ]}
    >
      <Text style={styles.iconLabel}>{label}</Text>
    </Pressable>
  );
}

function Toolbar() {
  return (
    <View style={styles.toolbar}>
      <IconButton label="←" onPress={() => console.log("back")} />
      <IconButton label="☆" onPress={() => console.log("favourite")} />
      <IconButton label="⋯" onPress={() => console.log("more")} />
    </View>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>1. Pressable</Text>
      <PressableDemo />

      <Text style={styles.sectionTitle}>2. TouchableOpacity</Text>
      <TouchableOpacityDemo />

      <Text style={styles.sectionTitle}>3. Swipe to delete</Text>
      <SwipeDemo />

      <Text style={styles.sectionTitle}>4. Fade in / out</Text>
      <FadeInDemo />

      <Text style={styles.sectionTitle}>5. Spring bounce</Text>
      <BounceDemo />

      <Text style={styles.sectionTitle}>6. Parallel animation</Text>
      <SequenceDemo />

      <Text style={styles.sectionTitle}>7. Keyboard dismiss</Text>
      <KeyboardDemo />

      <Text style={styles.sectionTitle}>8. hitSlop toolbar</Text>
      <Toolbar />
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    gap: 12,
    backgroundColor: "#f5f5f5",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 20,
    marginBottom: 4,
  },

  // buttons
  btn: {
    backgroundColor: "#1A73E8",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  btnPressed: {
    backgroundColor: "#1558b0",
    transform: [{ scale: 0.97 }],
  },
  btnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#1A73E8",
  },
  btnLabel: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  btnLabelPressed: { opacity: 0.8 },
  btnLabelOutline: { color: "#1A73E8" },

  // row layout
  row: { gap: 10 },

  // fade box
  fadeBox: {
    backgroundColor: "#1A73E8",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  // swipe to delete
  swipeRow: { marginBottom: 1, position: "relative" },
  deleteBtn: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#EA4335",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  deleteTxt: { color: "#fff", fontWeight: "bold" },
  swipeItem: { backgroundColor: "#fff", padding: 18 },
  swipeTitle: { fontSize: 16 },

  // keyboard
  keyboardArea: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },

  // toolbar
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  iconBtn: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  iconBtnPressed: { opacity: 0.4 },
  iconLabel: { fontSize: 18 },
});

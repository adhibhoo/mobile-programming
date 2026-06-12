import React, { useEffect, useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Modal,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

type Workout = {
    id: number;
    type: string;
    minutes: number;
    calories: number;
    date: string;
};

type CardProps = {
    title: string;
    value: string | number;
};

const WORKOUTS_KEY = 'workouts';

export default function App() {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    const [form, setForm] = useState({
        type: '',
        minutes: '',
    });

    const [goals] = useState({
        weeklyWorkouts: 5,
        weeklyMinutes: 300,
    });

    // ---------- LOAD DATA ----------
    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (!hasLoaded) return;
        saveData();
    }, [hasLoaded, workouts]);

    const loadData = async () => {
        try {
            const data = await AsyncStorage.getItem(WORKOUTS_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                if (Array.isArray(parsed)) setWorkouts(parsed);
            }
        } finally {
            setHasLoaded(true);
        }
    };

    const saveData = async () => {
        await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
    };

    // ---------- AUTO CALORIES ----------
    const calcCalories = (type: string, minutes: number) => {
        const rate: Record<string, number> = {
            Running: 10,
            Gym: 8,
            Cycling: 7,
            Yoga: 4,
        };
        return (rate[type] || 6) * minutes;
    };

    // ---------- ADD WORKOUT ----------
    const addWorkout = () => {
        if (!form.type || !form.minutes) return;

        const minutes = parseInt(form.minutes);
        if (Number.isNaN(minutes) || minutes <= 0) return;

        const newWorkout: Workout = {
            id: Date.now(),
            type: form.type,
            minutes,
            calories: calcCalories(form.type, minutes),
            date: new Date().toISOString().split('T')[0],
        };

        setWorkouts([newWorkout, ...workouts]);
        setForm({ type: '', minutes: '' });
        setModalVisible(false);
    };

    // ---------- STATS ----------
    const stats = useMemo(() => {
        const totalWorkouts = workouts.length;
        const totalMinutes = workouts.reduce((s, w) => s + w.minutes, 0);
        const totalCalories = workouts.reduce((s, w) => s + w.calories, 0);

        return { totalWorkouts, totalMinutes, totalCalories };
    }, [workouts]);

    // ---------- WEEK DATA ----------
    const weeklyWorkouts = workouts.filter(w => {
        const today = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        return new Date(w.date) >= weekAgo;
    });

    const weeklyMinutes = weeklyWorkouts.reduce((s, w) => s + w.minutes, 0);

    // ---------- STREAK ----------
    const getStreak = () => {
        let streak = 0;
        let current = new Date();

        const dates = [...new Set(workouts.map(w => w.date))];

        for (let i = 0; i < dates.length; i++) {
            const d = new Date(current);
            d.setDate(d.getDate() - i);
            const formatted = d.toISOString().split('T')[0];
            if (dates.includes(formatted)) streak++;
            else break;
        }

        return streak;
    };

    const streak = getStreak();

    // ---------- ACHIEVEMENTS ----------
    const achievements = [
        stats.totalWorkouts >= 1 && '🥇 First Workout',
        stats.totalWorkouts >= 10 && '💪 10 Workouts',
        stats.totalCalories >= 1000 && '🔥 1000 Calories',
        streak >= 5 && '⚡ 5 Day Streak',
    ].filter((achievement): achievement is string => Boolean(achievement));

    // ---------- NOTIFICATION (placeholder) ----------
    const sendReminder = () => {
        console.log("🔔 Reminder: Time to workout!");
    };

    // ---------- CALENDAR ----------
    const renderCalendar = () => {
        const days = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            const done = workouts.some(w => w.date === dateStr);

            days.push(
                <View key={i} style={styles.dayBox}>
                    <Text>{d.getDate()}</Text>
                    <Text>{done ? '🟢' : '⚪'}</Text>
                </View>
            );
        }

        return <View style={styles.calendar}>{days}</View>;
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>

                {/* HEADER */}
                <Text style={styles.title}>🏋️ Fitness Pro</Text>

                {/* STATS */}
                <View style={styles.row}>
                    <Card title="Workouts" value={stats.totalWorkouts} />
                    <Card title="Minutes" value={stats.totalMinutes} />
                </View>

                <View style={styles.row}>
                    <Card title="Calories" value={stats.totalCalories} />
                    <Card title="🔥 Streak" value={streak} />
                </View>

                {/* GOAL PROGRESS */}
                <Text style={styles.section}>Weekly Progress</Text>

                <Text>Workouts: {weeklyWorkouts.length}/{goals.weeklyWorkouts}</Text>
                <View style={styles.bar}>
                    <View style={[styles.fill, { width: `${(weeklyWorkouts.length / goals.weeklyWorkouts) * 100}%` }]} />
                </View>

                <Text>Minutes: {weeklyMinutes}/{goals.weeklyMinutes}</Text>
                <View style={styles.bar}>
                    <View style={[styles.fill, { width: `${(weeklyMinutes / goals.weeklyMinutes) * 100}%` }]} />
                </View>

                {/* CALENDAR */}
                <Text style={styles.section}>This Week</Text>
                {renderCalendar()}

                {/* ACHIEVEMENTS */}
                <Text style={styles.section}>Achievements</Text>
                {achievements.map((a, i) => (
                    <Text key={i}>{a}</Text>
                ))}

                {/* BUTTONS */}
                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                    <Text style={styles.btnText}>+ Add Workout</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.reminder} onPress={sendReminder}>
                    <Text style={styles.btnText}>🔔 Send Reminder</Text>
                </TouchableOpacity>

                {/* HISTORY */}
                <Text style={styles.section}>History</Text>

                {workouts.map(w => (
                    <View key={w.id} style={styles.item}>
                        <Text>{w.type} - {w.minutes} min</Text>
                        <Text>{w.calories} kcal</Text>
                        <Text style={{ fontSize: 10 }}>{w.date}</Text>
                    </View>
                ))}
            </ScrollView>

            {/* MODAL */}
            <Modal visible={modalVisible}>
                <View style={styles.modal}>
                    <Text style={styles.title}>Add Workout</Text>

                    <TextInput
                        placeholder="Type (Running, Gym...)"
                        style={styles.input}
                        value={form.type}
                        onChangeText={(t) => setForm({ ...form, type: t })}
                    />

                    <TextInput
                        placeholder="Minutes"
                        keyboardType="numeric"
                        style={styles.input}
                        value={form.minutes}
                        onChangeText={(t) => setForm({ ...form, minutes: t })}
                    />

                    <TouchableOpacity style={styles.button} onPress={addWorkout}>
                        <Text style={styles.btnText}>Save</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Text>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

// ---------- CARD ----------
function Card({ title, value }: CardProps) {
    return (
        <View style={styles.card}>
            <Text>{title}</Text>
            <Text style={styles.big}>{value}</Text>
        </View>
    );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    scroll: { paddingBottom: 50 },

    title: { fontSize: 26, fontWeight: 'bold', marginBottom: 10 },

    row: { flexDirection: 'row', justifyContent: 'space-between' },

    card: {
        flex: 1,
        margin: 5,
        padding: 15,
        backgroundColor: '#eee',
        borderRadius: 10,
    },

    big: { fontSize: 22, fontWeight: 'bold' },

    section: { marginTop: 20, fontSize: 18, fontWeight: 'bold' },

    button: {
        backgroundColor: '#2E86DE',
        padding: 12,
        marginTop: 15,
        borderRadius: 10,
        alignItems: 'center',
    },

    reminder: {
        backgroundColor: '#27AE60',
        padding: 12,
        marginTop: 10,
        borderRadius: 10,
        alignItems: 'center',
    },

    btnText: { color: '#fff', fontWeight: 'bold' },

    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },

    modal: { flex: 1, justifyContent: 'center', padding: 20 },

    input: {
        borderWidth: 1,
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
    },

    bar: {
        height: 10,
        backgroundColor: '#ddd',
        borderRadius: 10,
        marginBottom: 10,
    },

    fill: {
        height: 10,
        backgroundColor: '#2E86DE',
        borderRadius: 10,
    },

    calendar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    dayBox: {
        alignItems: 'center',
        padding: 5,
    },
});

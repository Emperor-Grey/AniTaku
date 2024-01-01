import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {getSchedule} from '../api/network';
const Calendar = () => {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const result = await getSchedule();
        setSchedule(result);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  console.log(schedule);

  // Render loading state while fetching data
  if (loading) {
    return (
      <View className="bg-neutral-950 flex-1 justify-center items-center">
        <Text className="text-white text-4xl">Loading...</Text>
      </View>
    );
  }

  // Render the schedule data
  return (
    <View className="bg-neutral-950 flex-1 justify-center items-center">
      {schedule && (
        <SafeAreaView className="flex-1 justify-center items-center">
          <Text className="text-white text-center">
            The Next Sunday Series is {'\n\n'}
            {schedule.sunday[0].title.english}
          </Text>
        </SafeAreaView>
      )}
    </View>
  );
};

export default Calendar;

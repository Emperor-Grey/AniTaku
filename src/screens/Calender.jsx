/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Swiper from 'react-native-swiper';
import {getSchedule} from '../api/network';

const {width} = Dimensions.get('window');

export default function Calender() {
  const swiper = useRef();
  const [value, setValue] = useState(new Date());
  const [week, setWeek] = useState(0);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigation();

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

  const weeks = React.useMemo(() => {
    const start = moment().add(week, 'weeks').startOf('week');

    return [-1, 0, 1].map(adj => {
      return Array.from({length: 7}).map((_, index) => {
        const date = moment(start).add(adj, 'week').add(index, 'day');

        return {
          weekday: date.format('ddd'),
          date: date.toDate(),
        };
      });
    });
  }, [week]);

  // Render loading state while fetching data
  if (loading) {
    return (
      <View className="bg-neutral-950 flex-1 justify-center items-center">
        <Text className="text-white text-4xl">Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-900">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, {color: '#fff'}]}>Your Schedule</Text>
        </View>

        {/* Swiper with weeks */}
        <View style={styles.picker}>
          <Swiper
            index={1}
            ref={swiper}
            loop={false}
            showsPagination={false}
            onIndexChanged={ind => {
              if (ind === 1) {
                return;
              }
              setTimeout(() => {
                const newIndex = ind - 1;
                const newWeek = week + newIndex;
                setWeek(newWeek);
                setValue(moment(value).add(newIndex, 'week').toDate());
                swiper.current.scrollTo(1, false);
              }, 100);
            }}>
            {weeks.map((dates, index) => (
              <View
                style={[styles.itemRow, {paddingHorizontal: 16}]}
                key={index}>
                {dates.map((item, dateIndex) => {
                  const dayKey = item.weekday.toLowerCase() + 'Schedule';
                  const dailySchedule = schedule[dayKey] || [];
                  const isActive =
                    value.toDateString() === item.date.toDateString();
                  return (
                    <TouchableWithoutFeedback
                      key={dateIndex}
                      onPress={() => setValue(item.date)}>
                      <View
                        style={[
                          styles.item,
                          isActive && {
                            backgroundColor: 'green',
                            borderColor: 'green',
                          },
                        ]}>
                        <Text
                          style={[
                            styles.itemWeekday,
                            isActive && {color: '#fff'},
                          ]}>
                          {item.weekday}
                        </Text>
                        <Text
                          style={[
                            styles.itemDate,
                            isActive && {color: '#fff'},
                          ]}>
                          {item.date.getDate()}
                        </Text>
                        {/* Render schedule information for the day */}
                        {dailySchedule.map((event, eventIndex) => (
                          <Text key={eventIndex}>{event.title}</Text>
                        ))}
                      </View>
                    </TouchableWithoutFeedback>
                  );
                })}
              </View>
            ))}
          </Swiper>
        </View>

        {/* Placeholder for schedule information */}
        <View style={{flex: 1, paddingHorizontal: 16, paddingVertical: 24}}>
          <Text style={[styles.subtitle, {color: '#999999'}]}>
            {value.toDateString()}
          </Text>
          {/* Additional content here if needed */}
          {/* Render The inside Data */}
          <Text className="text-white">{schedule.monday[0].title.english}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => {
              // handle onPress
              nav.goBack();
            }}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Go Back</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
  },
  placeholder: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    height: 400,
    marginTop: 0,
    padding: 0,
  },
  placeholderInset: {
    borderWidth: 2,
    borderColor: 'green',
    borderStyle: 'dashed',
    borderRadius: 10,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: 'green',
    borderColor: 'green',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  container: {
    flex: 1,
    paddingVertical: 24,
  },
  picker: {
    flex: 1,
    maxHeight: 80,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
  },
  header: {
    paddingHorizontal: 16,
  },
  footer: {
    marginTop: 'auto',
    paddingHorizontal: 16,
  },
  itemRow: {
    width: width,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginHorizontal: -4,
  },
  item: {
    flex: 1,
    height: 53,
    marginHorizontal: 4,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 8,
    flexDirection: 'column',
    alignItems: 'center',
  },
  itemWeekday: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
    color: 'white',
  },
  itemDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
  },
});

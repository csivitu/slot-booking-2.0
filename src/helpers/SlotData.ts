export const dates = ["2022-09-30", "2022-10-01", "2022-10-02"];

export const timeList = [
  {
    start: "08:00 AM",
    end: "08:15 AM",
  },
  {
    start: "08:15 AM",
    end: "08:30 AM",
  },
  {
    start: "08:30 AM",
    end: "08:45 AM",
  },
  {
    start: "08:45 AM",
    end: "09:00 AM",
  },
  {
    start: "09:00 AM",
    end: "09:15 AM",
  },
  {
    start: "09:15 AM",
    end: "09:30 AM",
  },
  {
    start: "09:30 AM",
    end: "09:45 AM",
  },
  {
    start: "09:45 AM",
    end: "10:00 AM",
  },
  {
    start: "10:00 AM",
    end: "10:15 AM",
  },
  {
    start: "10:15 AM",
    end: "10:30 AM",
  },
  {
    start: "10:30 AM",
    end: "10:45 AM",
  },
  {
    start: "10:45 AM",
    end: "11:00 AM",
  },
  {
    start: "11:00 AM",
    end: "11:15 AM",
  },
  {
    start: "11:15 AM",
    end: "11:30 AM",
  },
  {
    start: "11:30 AM",
    end: "11:45 AM",
  },
  {
    start: "11:45 AM",
    end: "12:00 PM",
  },
  {
    start: "12:00 PM",
    end: "12:15 PM",
  },
  {
    start: "12:15 PM",
    end: "12:30 PM",
  },
  {
    start: "12:30 PM",
    end: "12:45 PM",
  },
  {
    start: "12:45 PM",
    end: "01:00 PM",
  },
  {
    start: "02:00 PM",
    end: "02:15 PM",
  },
  {
    start: "02:15 PM",
    end: "02:30 PM",
  },
  {
    start: "02:30 PM",
    end: "02:45 PM",
  },
  {
    start: "02:45 PM",
    end: "03:00 PM",
  },
  {
    start: "03:00 PM",
    end: "03:15 PM",
  },
  {
    start: "03:15 PM",
    end: "03:30 PM",
  },
  {
    start: "03:30 PM",
    end: "03:45 PM",
  },
  {
    start: "03:45 PM",
    end: "04:00 PM",
  },
  {
    start: "04:00 PM",
    end: "04:15 PM",
  },
  {
    start: "04:15 PM",
    end: "04:30 PM",
  },
  {
    start: "04:30 PM",
    end: "04:45 PM",
  },
  {
    start: "04:45 PM",
    end: "05:00 PM",
  },
  {
    start: "05:00 PM",
    end: "05:15 PM",
  },
  {
    start: "05:15 PM",
    end: "05:30 PM",
  },
  {
    start: "05:30 PM",
    end: "05:45 PM",
  },
  {
    start: "05:45 PM",
    end: "06:00 PM",
  },
  {
    start: "06:00 PM",
    end: "06:15 PM",
  },
  {
    start: "06:15 PM",
    end: "06:30 PM",
  },
  {
    start: "06:30 PM",
    end: "06:45 PM",
  },
  {
    start: "06:45 PM",
    end: "07:00 PM",
  },
  {
    start: "07:00 PM",
    end: "07:15 PM",
  },
  {
    start: "07:15 PM",
    end: "07:30 PM",
  },
  {
    start: "07:30 PM",
    end: "07:45 PM",
  },
  {
    start: "07:45 PM",
    end: "08:00 PM",
  },
];

export const generateSlotData = () => {
  const slots = [0, 1, 2].map((day) =>
    (day === 0 ? timeList.slice(4) : timeList).map((time) => {
      const d = {
        startTime: new Date(`${time.start} ${dates[day]} GMT+0530`),
        endTime: new Date(`${time.end} ${dates[day]} GMT+0530`),
        day: day,
        slotBookedBy: [],
      };
      return d;
    })
  );
  return [...slots[0], ...slots[1], ...slots[2]];
};

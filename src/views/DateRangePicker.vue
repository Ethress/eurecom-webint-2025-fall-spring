<template>
  <div class="date-picker">
    <div class="header">
      <button @click="prevMonth">&lt;</button>
      <span>{{ monthNames[currentMonth] }} {{ currentYear }}</span>
      <button @click="nextMonth">&gt;</button>
    </div>

    <div class="week-days">
      <span v-for="day in weekDays" :key="day">{{ day }}</span>
    </div>

    <div class="days">
      <span
        v-for="cell in daysInMonth"
        :key="cell.date"
        :class="{
          'start-date': isStart(cell.date),
          'end-date': isEnd(cell.date),
          'in-range': isInRange(cell.date)
        }"
        @click="selectDate(cell.date)"
      >
        {{ cell.day }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DateRangePicker',
  data() {
    return {
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      startDate: null,
      endDate: null,
      monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ]
    };
  },
  computed: {
    weekDays() {
      return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    },
    daysInMonth() {
      const days = [];
      const firstOfMonth = new Date(this.currentYear, this.currentMonth, 1);
      const offset = firstOfMonth.getDay();

      // Fill blanks for days from previous month
      for (let i = 0; i < offset; i++) {
        days.push({ date: null, day: '' });
      }

      const total = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
      for (let d = 1; d <= total; d++) {
        days.push({
          date: new Date(this.currentYear, this.currentMonth, d),
          day: d
        });
      }
      return days;
    }
  },
  methods: {
    selectDate(date) {
      if (!date) return;
      // If no start or both are set, reset
      if (!this.startDate || (this.startDate && this.endDate)) {
        this.startDate = date;
        this.endDate = null;
      } else if (this.startDate && !this.endDate) {
        if (date < this.startDate) {
          // If clicked before start, reset start
          this.startDate = date;
        } else {
          this.endDate = date;
        }
      }
    },
    isStart(date) {
      return this.startDate && date && date.toDateString() === this.startDate.toDateString();
    },
    isEnd(date) {
      return this.endDate && date && date.toDateString() === this.endDate.toDateString();
    },
    isInRange(date) {
      return (
        this.startDate &&
        this.endDate &&
        date >= this.startDate &&
        date <= this.endDate
      );
    },
    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    }
  }
};
</script>

<style scoped>
.date-picker {
  width: 280px;
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.9); /*Background color of datepicker*/
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.week-days, .days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
}
.days span {
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
}
.start-date, .end-date {
  background-color: #3b82f6;
  color: white;
}
.in-range {
  background-color: #bfdbfe;
}
</style>

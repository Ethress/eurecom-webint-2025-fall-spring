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
        :key="cell.date?.toDateString() + '-' + cell.day"
        :class="{
          'start-date': isStart(cell.date),
          'end-date': isEnd(cell.date),
          'in-range': isInRange(cell.date),
          'unavailable': isUnavailable(cell.date)
        }"
        @click="selectDate(cell.date)"
      >
        {{ cell.day }}
      </span>
    </div>
  </div>

  <div class="footer">
    <button
      class="select-button"
      :disabled="!startDate || !endDate"
      @click="confirmSelection"
    >
      Select
    </button>
  </div>
</template>

<script>
export default {
  name: 'DateRangePicker',
  props: {
    // Array of { start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' }
    reservedDates: {type: Array,default: () => [] },
    initialStart:  { type: Date,  default: null },
    initialEnd:    { type: Date,  default: null }
  },
  data() {
    return {
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      startDate:    this.initialStart,
      endDate:      this.initialEnd,
      monthNames: [
        'January','February','March','April','May','June',
        'July','August','September','October','November','December'
      ]
    };
  },
  watch: {
   initialStart(val) { this.startDate = val },
   initialEnd(val)   { this.endDate   = val }
  },
  computed: {
    weekDays() {
      return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    },
    daysInMonth() {
      const days = [];
      const firstOfMonth = new Date(this.currentYear, this.currentMonth, 1);
      const offset = firstOfMonth.getDay();

      // blank slots for previous‐month days
      for (let i = 0; i < offset; i++) {
        days.push({ date: null, day: '' });
      }

      const total = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
      for (let d = 1; d <= total; d++) {
        const dateObj = new Date(this.currentYear, this.currentMonth, d);
        days.push({ date: dateObj, day: d });
      }
      return days;
    }
  },
  methods: {
    selectDate(date) {
      if (!date || this.isUnavailable(date)) return;
      if (!this.startDate || (this.startDate && this.endDate)) {
        this.startDate = date;
        this.endDate = null;
      } else if (this.startDate && !this.endDate) {
        if (date < this.startDate) {
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
        date > this.startDate &&
        date < this.endDate
      );
    },
    isUnavailable(date) {
      if (!date) return false;
      // check if “date” is inside any reservedDates range
      return this.reservedDates.some(range => {
        const rs = new Date(range.start).getTime();
        const re = new Date(range.end).getTime();
        const d  = date.getTime();
        return d >= rs && d <= re;
      });
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
    },
    confirmSelection() {
      this.$emit('confirm', { start: this.startDate, end: this.endDate });
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
  background-color: rgba(255,255,255,0.9);
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
/* Your existing styles: */
.start-date {
  background-color: rgb(59,246,125);
  color: white;
}
.end-date {
  background-color: rgb(241,24,24);
  color: white;
}
.in-range {
  background-color: #bfdbfe;
}
/* New unavailable style: */
.unavailable {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}
.select-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

<script lang="ts" setup>
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Dars jadvali ma'lumotlari matritsasi (4 qator x 5 ustun)
// Har bir obyekt: { fan: string, oqituvchi: string }
const timetableData = [
  // Row 1 (1-dars)
  [
    { subject: 'Mathematics', teacher: 'Mr. Smith' },
    { subject: 'Physics', teacher: 'Ms. Garcia' },
    { subject: 'History', teacher: 'Dr. Jones' },
    { subject: 'Literature', teacher: 'Mrs. Davis' },
    { subject: 'Mathematics', teacher: 'Mr. Smith' },
  ],
  // Row 2 (2-dars)
  [
    { subject: 'Biology', teacher: 'Ms. Kim' },
    { subject: 'Chemistry', teacher: 'Mr. Patel' },
    { subject: 'Mathematics', teacher: 'Mr. Smith' },
    { subject: 'History', teacher: 'Dr. Jones' },
    { subject: 'Literature', teacher: 'Mrs. Davis' },
  ],
  // Row 3 (3-dars)
  [
    { subject: 'Art', teacher: 'Mr. Ivanovich' },
    { subject: 'Music', teacher: 'Mrs. Brown' },
    { subject: 'Physical Ed.', teacher: 'Coach Khan' },
    { subject: 'Biology', teacher: 'Ms. Kim' },
    { subject: 'Chemistry', teacher: 'Mr. Patel' },
  ],
  // Row 4 (4-dars)
  [
    { subject: 'Literature', teacher: 'Mrs. Davis' },
    { subject: 'History', teacher: 'Dr. Jones' },
    { subject: 'Mathematics', teacher: 'Mr. Smith' },
    { subject: 'Physics', teacher: 'Ms. Garcia' },
    { subject: 'Physical Ed.', teacher: 'Coach Khan' },
  ],
];
</script>

<template>
  <section class="py-24 overflow-hidden bg-white">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="text-center max-w-3xl mx-auto mb-16">
            <h2 
                data-aos="fade-up" 
                data-aos-once="false" 
                class="text-3xl font-bold text-gray-900 mb-4"
            >
                Clear Weekly Overview
            </h2>
            
            <p 
                data-aos="fade-up" 
                data-aos-delay="100" 
                data-aos-once="false" 
                class="text-gray-500 text-lg"
            >
                Drag & drop to adjust your timetable instantly with our intuitive interface.
            </p>
          </div>

          <div 
            data-aos="zoom-in" 
            data-aos-delay="200" 
            data-aos-duration="1000" 
            data-aos-once="false" 
            class="bg-blue-50/50 rounded-[32px] p-6 sm:p-10 border border-blue-100 shadow-2xl shadow-blue-900/5 select-none"
          >
            <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
              
              <div class="bg-blue-600 text-white p-6">
                <h3 class="text-xl font-bold">Grade 10-A Weekly Schedule</h3>
                <p class="text-blue-100 text-sm mt-1">32 students • Mrs. Johnson (Homeroom)</p>
              </div>
              
              <div class="p-6 overflow-x-auto">
                <div class="min-w-[800px]">
                  
                  <div class="grid grid-cols-5 gap-4 mb-4">
                    <div v-for="day in days" :key="day" class="bg-gray-50 text-center py-2.5 rounded-lg text-sm font-semibold text-gray-700">
                      {{ day }}
                    </div>
                  </div>
                  
                  <div v-for="(periodRow, periodIdx) in timetableData" :key="periodIdx" class="grid grid-cols-5 gap-4 mb-4">
                    
                    <div v-for="(lesson, dayIdx) in periodRow" :key="dayIdx" class="bg-blue-50 border border-blue-100 rounded-xl p-3 hover:bg-blue-100 transition-colors cursor-pointer">
                      <p class="text-[11px] font-semibold text-blue-600 mb-1">Period {{ periodIdx + 1 }}</p>
                      
                      <p class="text-sm font-bold text-gray-900">{{ lesson.subject }}</p>
                      
                      <p class="text-xs text-gray-500 mt-1">{{ lesson.teacher }}</p>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
</template>
<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="bg-white rounded-[2.5rem] shadow-2xl border border-green-50 overflow-hidden">
      <div class="relative bg-green-600 p-10 text-white overflow-hidden">
        <!-- Decorative background elements -->
        <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div class="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-green-400/20 rounded-full blur-2xl"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2">
            <h2 class="text-4xl font-black tracking-tight">Personalize Your Plan</h2>
            <p class="text-green-100 text-lg">Let's craft the perfect healthy menu for your body.</p>
          </div>
          <div class="hidden md:flex items-center space-x-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <Activity class="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div class="text-xs font-bold uppercase tracking-widest opacity-70">Goal</div>
              <div class="font-bold">Healthy Living</div>
            </div>
          </div>
        </div>
      </div>
      
      <form @submit.prevent="handleSubmit" class="p-10 space-y-12">
        <!-- Basic Info Section -->
        <div class="space-y-8">
          <div class="flex items-center space-x-3 border-b border-gray-100 pb-4">
            <User class="w-6 h-6 text-green-600" />
            <h3 class="text-xl font-bold text-gray-900">Basic Information</h3>
          </div>
          
          <div class="grid md:grid-cols-2 gap-8">
            <div class="space-y-3">
              <label class="text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
              <div class="relative group">
                <input 
                  v-model="form.name" 
                  type="text" 
                  required
                  placeholder="Enter your name"
                  class="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all bg-gray-50/50 group-hover:bg-white"
                />
                <User class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
              </div>
            </div>
            
            <div class="space-y-3">
              <label class="text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">Age</label>
              <div class="relative group">
                <input 
                  v-model.number="form.age" 
                  type="number" 
                  required
                  min="1"
                  max="120"
                  placeholder="Your age"
                  class="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all bg-gray-50/50 group-hover:bg-white"
                />
                <Calendar class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
              </div>
            </div>

            <div class="space-y-3">
              <label class="text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">Gender</label>
              <div class="relative group">
                <select 
                  v-model="form.gender" 
                  required
                  class="w-full pl-12 pr-10 py-4 rounded-2xl border-2 border-gray-100 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all bg-gray-50/50 group-hover:bg-white appearance-none"
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <Users class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div class="space-y-3">
              <label class="text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">Allergies</label>
              <div class="relative group">
                <select 
                  v-model="selectedAllergy" 
                  @change="addAllergy"
                  class="w-full pl-12 pr-10 py-4 rounded-2xl border-2 border-gray-100 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all bg-gray-50/50 group-hover:bg-white appearance-none"
                >
                  <option value="" disabled>Add Allergy</option>
                  <option v-for="opt in allergyOptions" :key="opt" :value="opt" :disabled="form.allergies.includes(opt)">
                    {{ opt.charAt(0).toUpperCase() + opt.slice(1) }}
                  </option>
                </select>
                <ShieldAlert class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              <!-- Selected Allergies Tags -->
              <div class="flex flex-wrap gap-2 mt-2">
                <span 
                  v-for="allergy in form.allergies" 
                  :key="allergy"
                  class="inline-flex items-center px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold border border-red-100"
                >
                  {{ allergy }}
                  <button @click="removeAllergy(allergy)" type="button" class="ml-2 hover:text-red-800">
                    <X class="w-3 h-3" />
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Body Metrics Section -->
        <div class="space-y-8">
          <div class="flex items-center space-x-3 border-b border-gray-100 pb-4">
            <Scale class="w-6 h-6 text-green-600" />
            <h3 class="text-xl font-bold text-gray-900">Body Metrics</h3>
          </div>
          
          <div class="grid md:grid-cols-2 gap-8">
            <div class="space-y-3">
              <label class="text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">Height (cm)</label>
              <div class="relative group">
                <input 
                  v-model.number="form.height" 
                  type="number" 
                  required
                  min="50"
                  max="250"
                  placeholder="175"
                  class="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all bg-gray-50/50 group-hover:bg-white"
                />
                <Ruler class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
              </div>
            </div>
            
            <div class="space-y-3">
              <label class="text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">Weight (kg)</label>
              <div class="relative group">
                <input 
                  v-model.number="form.weight" 
                  type="number" 
                  required
                  min="20"
                  max="300"
                  placeholder="70"
                  class="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all bg-gray-50/50 group-hover:bg-white"
                />
                <Weight class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
              </div>
            </div>
          </div>
        </div>

        <!-- Diet Type Section -->
        <div class="space-y-8">
          <div class="flex items-center space-x-3 border-b border-gray-100 pb-4">
            <Utensils class="w-6 h-6 text-green-600" />
            <h3 class="text-xl font-bold text-gray-900">Dietary Preference</h3>
          </div>
          
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              v-for="diet in dietOptions" 
              :key="diet.value"
              type="button"
              @click="form.dietType = diet.value"
              class="relative p-6 rounded-3xl border-2 transition-all flex flex-col items-center text-center space-y-3 group"
              :class="form.dietType === diet.value ? 'border-green-500 bg-green-50 shadow-lg shadow-green-100' : 'border-gray-100 hover:border-green-200 hover:bg-gray-50'"
            >
              <div 
                class="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors"
                :class="form.dietType === diet.value ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-green-100 group-hover:text-green-600'"
              >
                <component :is="diet.icon" class="w-7 h-7" />
              </div>
              <div>
                <div class="font-bold text-gray-900">{{ diet.label }}</div>
                <div class="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{{ diet.sub }}</div>
              </div>
              <div v-if="form.dietType === diet.value" class="absolute top-3 right-3">
                <CheckCircle2 class="w-5 h-5 text-green-600" />
              </div>
            </button>
          </div>
        </div>
        
        <div class="pt-10">
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full py-6 bg-green-600 text-white rounded-[2rem] font-black text-xl hover:bg-green-700 transition-all shadow-2xl shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
          >
            <Loader2 v-if="loading" class="w-6 h-6 mr-3 animate-spin" />
            <span v-else class="flex items-center">
              Generate My Custom Plan
              <ArrowRight class="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </span>
          </button>
          <p class="text-center text-gray-400 text-sm mt-6 font-medium">Takes less than 1 minute to analyze</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFoodStore } from '@/stores/useFoodStore';
import { 
  Loader2, User, Calendar, Users, Ruler, Weight, 
  Utensils, Activity, ArrowRight, ChevronDown, 
  Leaf, Beef, Egg, Salad, CheckCircle2, ShieldAlert, X, Scale
} from 'lucide-vue-next';

const router = useRouter();
const foodStore = useFoodStore();
const loading = ref(false);
const selectedAllergy = ref('');

const form = ref({
  name: '',
  age: null,
  gender: '',
  height: null,
  weight: null,
  dietType: 'veg',
  allergies: []
});

const allergyOptions = ['dairy', 'peanuts', 'gluten', 'eggs'];

const dietOptions = [
  { label: 'Vegetarian', value: 'veg', icon: Leaf, sub: 'Plant Based' },
  { label: 'Non-Veg', value: 'non_veg', icon: Beef, sub: 'Meat & More' },
  { label: 'Eggetarian', value: 'eggetarian', icon: Egg, sub: 'Eggs Included' },
  { label: 'Vegan', value: 'vegan', icon: Salad, sub: 'Pure Plant' }
];

const addAllergy = () => {
  if (selectedAllergy.value && !form.value.allergies.includes(selectedAllergy.value)) {
    form.value.allergies.push(selectedAllergy.value);
  }
  selectedAllergy.value = '';
};

const removeAllergy = (allergy) => {
  form.value.allergies = form.value.allergies.filter(a => a !== allergy);
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    await foodStore.submitUserForm(form.value);
    router.push('/meals');
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

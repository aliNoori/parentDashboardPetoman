<template>
  <li class="list-none">
    <div
      @click="handleSelect"
      class="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm flex items-center transition-colors"
      :class="isSelected ? 'bg-blue-50 text-blue-700' : ''"
      :style="{ paddingRight: (level * 1.5 + 0.75) + 'rem' }"
    >
      <!-- Expand/Collapse Button -->
      <button
        v-if="category.children && category.children.length > 0"
        @click.stop="toggleExpand"
        class="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded mr-1"
      >
        <i class="ti text-xs transition-transform" :class="isExpanded ? 'ti-chevron-down' : 'ti-chevron-left'"></i>
      </button>
      <div v-else class="w-5 mr-1"></div>
      
      <!-- Folder Icon -->
      <i class="ti ml-2" :class="category.children && category.children.length > 0 ? 'ti-folder text-yellow-600' : 'ti-folder text-gray-400'"></i>
      
      <!-- Category Name -->
      <span class="flex-1">{{ category.title }}</span>
      
      <!-- Selected Check -->
      <i v-if="isSelected" class="ti ti-check text-blue-600"></i>
    </div>
    
    <!-- Children (Recursive) as UL -->
    <ul v-if="isExpanded && category.children && category.children.length > 0" class="p-0 m-0 list-none">
      <ParentCategoryItem
        v-for="child in category.children"
        :key="child.id"
        :category="child"
        :selected-id="selectedId"
        :level="level + 1"
        @select="$emit('select', $event)"
      />
    </ul>
  </li>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  category: {
    type: Object,
    required: true
  },
  selectedId: {
    type: [String, Number, null],
    default: null
  },
  level: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['select'])

const isExpanded = ref(false)

const isSelected = computed(() => {
  return props.selectedId === props.category.id
})

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const handleSelect = () => {
  emit('select', props.category.id)
}
</script>

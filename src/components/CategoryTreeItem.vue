<template>
  <li class="list-none">
    <div
      @click="handleSelect"
      class="px-3 py-2 hover:bg-gray-50 cursor-pointer rounded-md transition-colors flex items-center group"
      :class="isSelected ? 'bg-blue-50' : ''"
      :style="{ paddingRight: (level * 1.5 + 0.75) + 'rem' }"
    >
      <!-- Expand/Collapse Button -->
      <button
        v-if="category.children && category.children.length > 0"
        @click.stop="toggleExpand"
        class="w-5 h-5 flex items-center justify-center hover:bg-gray-200 rounded mr-1 flex-shrink-0"
      >
        <i class="ti text-xs transition-transform" :class="isExpanded ? 'ti-chevron-down' : 'ti-chevron-left'"></i>
      </button>
      <div v-else class="w-5 mr-1"></div>
      
      <!-- Checkbox -->
      <div
        class="w-4 h-4 border-2 rounded flex items-center justify-center mr-2 flex-shrink-0 transition-colors"
        :class="isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'"
      >
        <i v-if="isSelected" class="ti ti-check text-white text-xs"></i>
      </div>
      
      <!-- Folder Icon -->
      <i class="ti ml-2 flex-shrink-0" :class="category.children && category.children.length > 0 ? 'ti-folder text-yellow-600' : 'ti-folder text-gray-400'"></i>
      
      <!-- Category Name -->
      <span class="text-sm flex-1" :class="isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'">
        {{ category.title }}
      </span>
      
      <!-- Count Badge -->
      <span v-if="category.children && category.children.length > 0" class="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
        {{ category.children.length }}
      </span>
    </div>
    
    <!-- Children (Recursive) as UL -->
    <ul v-if="isExpanded && category.children && category.children.length > 0" class="mt-1 p-0 m-0 list-none">
      <CategoryTreeItem
        v-for="child in category.children"
        :key="child.id"
        :category="child"
        :selected-ids="selectedIds"
        :level="level + 1"
        @toggle="$emit('toggle', $event)"
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
  selectedIds: {
    type: Array,
    default: () => []
  },
  level: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['toggle', 'select'])

const isExpanded = ref(false)

const isSelected = computed(() => {
  return props.selectedIds.includes(props.category.id)
})

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
  emit('toggle', props.category.id)
}

const handleSelect = () => {
  emit('select', props.category.id)
}
</script>

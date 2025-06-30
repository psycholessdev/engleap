'use client'
import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const ProficiencyLevelPicker: React.FC<{
  disabled: boolean
  value: string
  onChange: (value: string) => void
}> = ({ disabled, value, onChange }) => {
  return (
    <Select disabled={disabled} value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Proficiency level" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="A1">A1 (Beginner)</SelectItem>
        <SelectItem value="A2">A2 (Basic)</SelectItem>
        <SelectItem value="B1">B1 (Intermediate)</SelectItem>
        <SelectItem value="B2">B2 (Upper Intermediate)</SelectItem>
        <SelectItem value="C1">C1 (Advanced)</SelectItem>
        <SelectItem value="C2">C2 (Proficient)</SelectItem>
      </SelectContent>
    </Select>
  )
}
export default React.memo(ProficiencyLevelPicker)

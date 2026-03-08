import React from 'react'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

import { options } from '@/lib/data'

const DateTimeFilter = ({ dateQuery, setDateQuery }) => {
  const selectedLabel = options.find(opt => opt.value === dateQuery)?.label || "";

  return (
    <Combobox value={dateQuery} onValueChange={setDateQuery} items={options}>
      <ComboboxInput placeholder="Chọn mốc thời gian" value={selectedLabel} readOnly />
      <ComboboxContent>
        <ComboboxEmpty>Không tìm thấy.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item.value}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export default DateTimeFilter
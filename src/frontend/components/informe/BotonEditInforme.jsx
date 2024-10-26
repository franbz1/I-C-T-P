import { useState } from 'react'
import { Pressable } from 'react-native'
import { PencilIcon } from 'react-native-heroicons/outline'

function BotonEditInforme({ onToggleEdit }) {
  const [isEditing, setIsEditing] = useState(false)

  const handlePress = () => {
    setIsEditing(!isEditing)
    onToggleEdit(!isEditing)
  }
  return (
    <Pressable
      className={`absolute bottom-6 right-4 rounded-full p-3 shadow-lg ${
        isEditing ? 'bg-green-500' : 'bg-yellow-500'
      }`}
      onPress={handlePress}
    >
      <PencilIcon
        color='white'
        size={24}
      />
    </Pressable>
  )
}

export default BotonEditInforme

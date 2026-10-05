import { Card } from '../../components/Card'
import { TextField } from '../../components/TextField'
import { useAppStore } from '../../store/useAppStore'
import { CategoriesEditor } from './CategoriesEditor'
import { MealsEditor } from './MealsEditor'

export function Settings() {
  const personName = useAppStore((state) => state.settings.personName)
  const setPersonName = useAppStore((state) => state.setPersonName)

  return (
    <div className="space-y-8">
      <Card>
        <TextField label="Tu nombre" value={personName} onChange={setPersonName} placeholder="Ej.: Ana" />
      </Card>
      <CategoriesEditor />
      <MealsEditor />
    </div>
  )
}

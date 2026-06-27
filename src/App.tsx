import { TenantProvider } from './tenant/TenantProvider'
import { useUiStore } from './stores/uiStore'
import { RoomSetupScreen } from './setup/RoomSetupScreen'
import { PlannerApp } from './planner/PlannerApp'

const AppContent = () => {
  const screen = useUiStore((s) => s.screen)
  return screen === 'setup' ? <RoomSetupScreen /> : <PlannerApp />
}

const App = () => (
  <TenantProvider>
    <AppContent />
  </TenantProvider>
)

export default App

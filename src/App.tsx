import { TenantProvider } from './tenant/TenantProvider'
import { useUiStore } from './stores/uiStore'
import { WelcomeScreen } from './screens/WelcomeScreen'
import { AIGenerateScreen } from './screens/AIGenerateScreen'
import { RoomSetupScreen } from './setup/RoomSetupScreen'
import { PlannerApp } from './planner/PlannerApp'

const AppContent = () => {
  const screen = useUiStore((s) => s.screen)
  if (screen === 'welcome')     return <WelcomeScreen />
  if (screen === 'ai-generate') return <AIGenerateScreen />
  if (screen === 'setup')       return <RoomSetupScreen />
  return <PlannerApp />
}

const App = () => (
  <TenantProvider>
    <AppContent />
  </TenantProvider>
)

export default App

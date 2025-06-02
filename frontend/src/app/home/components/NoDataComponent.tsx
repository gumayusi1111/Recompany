import { uiTextConfig } from '../config'

export function NoDataComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">{uiTextConfig.noData}</p>
    </div>
  )
}

import { uiTextConfig, styleConfig } from '../config'

export function LoadingComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div
          className="animate-spin rounded-full h-32 w-32 border-b-2 mx-auto"
          style={{ borderColor: styleConfig.colors.primary }}
        ></div>
        <p className="mt-4 text-gray-600">{uiTextConfig.loading}</p>
      </div>
    </div>
  )
}

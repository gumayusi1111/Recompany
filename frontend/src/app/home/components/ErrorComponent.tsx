import { uiTextConfig, styleConfig } from '../config'

interface ErrorComponentProps {
  error: string
}

export function ErrorComponent({ error }: ErrorComponentProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div
          className="text-xl mb-4"
          style={{ color: styleConfig.colors.error }}
        >
          ❌ {uiTextConfig.loadingFailed}
        </div>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 text-white rounded hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: styleConfig.colors.primary,
            borderRadius: styleConfig.sizes.borderRadius
          }}
        >
          {uiTextConfig.reload}
        </button>
      </div>
    </div>
  )
}

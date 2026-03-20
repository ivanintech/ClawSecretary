export interface SetupData {
  userId: string
  bridgeUrl: string
  bridgeToken: string
  encryptedSession: string
  phoneNumber: string | null
}

export function decodeSetupCode(code: string): SetupData {
  try {
    const data = JSON.parse(Buffer.from(code.trim(), 'base64').toString('utf-8'))
    if (!data.userId || !data.bridgeUrl || !data.bridgeToken || !data.encryptedSession) {
      throw new Error('Missing required fields in setup code')
    }
    return data as SetupData
  } catch (error) {
    throw new Error(`Invalid setup code: ${error instanceof Error ? error.message : error}`)
  }
}

export async function scanQRFromImage(_imagePath: string): Promise<SetupData> {
  throw new Error('QR image scanning not implemented. Use --code option with base64 setup code instead.')
}

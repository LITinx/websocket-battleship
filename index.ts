import { configDotenv } from 'dotenv'
import { httpServer } from './src/http_server/index.js'
import { BattleShipServer } from './src/ws_server/index.js'
configDotenv()
const HTTP_PORT = Number(process.env.HTTP_PORT || 8181)
const WS_PORT = Number(process.env.WS_PORT || 3000)
const wss = new BattleShipServer({ port: WS_PORT })

process.on('SIGINT', () => {
	wss.close()
	httpServer.close()
})

console.log(`Start static http server on the ${HTTP_PORT} port!`)
httpServer.listen(HTTP_PORT)

const mineflayer = require('mineflayer')
const fs = require('fs')
const path = require('path')

const configPath = path.join(process.cwd(), 'config.json')
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
// Ưu tiên biến môi trường hơn config.json
if (process.env.MC_HOST) config.host = process.env.MC_HOST
if (process.env.MC_PORT) config.port = parseInt(process.env.MC_PORT)
if (process.env.MC_USERNAME) config.username = process.env.MC_USERNAME
if (process.env.MC_PASSWORD) config.password = process.env.MC_PASSWORD
if (process.env.MC_SERVER_SLOT) config.serverSlot = parseInt(process.env.MC_SERVER_SLOT)

function createBot() {
  const bot = mineflayer.createBot({
      host: config.host,
          port: config.port || 25565,
              username: config.username,
                  version: '1.16.5',
                      auth: 'offline'
                        })

                          bot.once('spawn', () => {
                              console.log('✅ Đã vào server!')
                                  runFlow(bot)
                                    })

                                      bot.on('kicked', (reason) => {
                                          console.log('❌ Bị kick:', reason)
                                              setTimeout(createBot, 10000)
                                                })

                                                  bot.on('end', () => {
                                                      console.log('🔄 Reconnecting...')
                                                          setTimeout(createBot, 10000)
                                                            })

                                                              bot.on('error', (err) => {
                                                                  console.log('⚠️ Error:', err.message)
                                                                      setTimeout(createBot, 10000)
                                                                        })
                                                                        }

                                                                        async function runFlow(bot) {
                                                                          const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
                                                                            try {
                                                                                // BƯỚC 1: Đăng nhập
                                                                                    await sleep(2000)
                                                                                        bot.chat('/dn')
                                                                                            console.log('→ Gửi /dn')
                                                                                                await sleep(1500)
                                                                                                    bot.chat(config.password)
                                                                                                        console.log('→ Gửi mật khẩu')

                                                                                                            // BƯỚC 2: Chọn server trong menu GUI
                                                                                                                await sleep(3000)
                                                                                                                    bot.once('windowOpen', async (window) => {
                                                                                                                          console.log('→ Menu mở, click slot', config.serverSlot)
                                                                                                                                await sleep(1000)
                                                                                                                                      bot.simpleClick.leftMouse(config.serverSlot || 0)
                                                                                                                                            console.log('→ Đã chọn server!')
                                                                                                                                                })

                                                                                                                                                    // BƯỚC 3: Gõ /afk
                                                                                                                                                        await sleep(8000)
                                                                                                                                                            bot.chat('/afk')
                                                                                                                                                                console.log('→ Đã gõ /afk')

                                                                                                                                                                    // BƯỚC 4: Anti-AFK mỗi 5 phút
                                                                                                                                                                        startAntiAFK(bot)

                                                                                                                                                                          } catch (err) {
                                                                                                                                                                              console.log('❌ Lỗi:', err.message)
                                                                                                                                                                                }
                                                                                                                                                                                }

                                                                                                                                                                                function startAntiAFK(bot) {
                                                                                                                                                                                  setInterval(async () => {
                                                                                                                                                                                      if (!bot.entity) return
                                                                                                                                                                                          const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
                                                                                                                                                                                              console.log('🏃 Anti-AFK...')

                                                                                                                                                                                                  bot.setControlState('jump', true)
                                                                                                                                                                                                      await sleep(500)
                                                                                                                                                                                                          bot.setControlState('jump', false)

                                                                                                                                                                                                              await sleep(500)
                                                                                                                                                                                                                  bot.look(Math.random() * Math.PI * 2, 0, false)

                                                                                                                                                                                                                      await sleep(500)
                                                                                                                                                                                                                          const dirs = ['forward', 'back', 'left', 'right']
                                                                                                                                                                                                                              const dir = dirs[Math.floor(Math.random() * dirs.length)]
                                                                                                                                                                                                                                  bot.setControlState(dir, true)
                                                                                                                                                                                                                                      await sleep(1000)
                                                                                                                                                                                                                                          bot.setControlState(dir, false)

                                                                                                                                                                                                                                              await sleep(1000)
                                                                                                                                                                                                                                                  bot.chat('/afk')
                                                                                                                                                                                                                                                      console.log('→ Gõ lại /afk')

                                                                                                                                                                                                                                                        }, 5 * 60 * 1000)
                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                        createBot()
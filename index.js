const ci = require('miniprogram-ci')
const Qs = require('qs')

const packageJson = require('./package.json')
const projectJson = require('./src/manifest.json')

const {
  env = 'dev',
  act = 'upload',
  robot = 1
} = Qs.parse(process.argv[2]?.replace(/@/g, '&')) || {}

const project = new ci.Project({
  appid: projectJson['mp-weixin'].appid,
  type: 'miniProgram',
  projectPath: `./dist/${env}/mp-weixin`,
  privateKeyPath: `./private.${projectJson['mp-weixin'].appid}.key`
})

const Fn = {
  async upload() {
    const uploadResult = await ci
      .upload({
        project,
        version: packageJson.version,
        setting: {
          es6: true,
          es7: true,
          minify: true,
          autoPrefixWXSS: true
        },
        robot: Number(robot),
        onProgressUpdate: console.log
      })
      .catch(err => {
        console.log('err：', err)
        process.exit(1)
      })
    console.log('result:', uploadResult)
  },
  async preview() {
    const previewResult = await ci
      .preview({
        project,
        setting: {
          es6: true,
          es7: true,
          minify: true,
          autoPrefixWXSS: true
        },
        robot: Number(robot),
        qrcodeFormat: 'image',
        qrcodeOutputDest: './dist/code.jpg',
        onProgressUpdate: console.log
      })
      .catch(err => {
        console.log('err：', err)
        process.exit(1)
      })
    console.log('result:', previewResult)
  }
}

Fn[act]()

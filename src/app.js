const express = require('express')
const Ffmpeg = require('fluent-ffmpeg')
const { rmdir, rmdirSync } = require('fs')
const path = require('path')

const app = express()
const port = 8000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/video', async (req, res) => {
  const tmpDir = path.resolve(`${__dirname}/../public/tmp`)

  rmdir(tmpDir, { recursive: true }, () => {
    const randomFileName = `${Math.random().toString(36).substring(2, 15)}-thumbnail.png`
    const file = path.resolve(`${tmpDir}/${randomFileName}`)

    const { video_source } = req.query

    Ffmpeg({ source: video_source })
      .on('filename', filename => {
        console.log('Created filename: ' + filename)
      })
      .on('end', () => {
        console.log('Finished processing')
        res.sendFile(file)
      })
      .on('error', err => {
        console.log('Error: ', err)
        res.sendStatus(500)
      })
      .takeScreenshots({
        filename: randomFileName,
        count: 1,
        size: '?x190'
      }, tmpDir)
  })
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
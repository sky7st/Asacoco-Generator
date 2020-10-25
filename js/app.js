const { ref, onMounted } = Vue

const app = Vue.createApp({
  setup(props, context) {
    const input = ref({
      id: 'A2020000001',
      name: '桐生ココ',
      dep: '一擊必殺科',
      avatar: null
    })
    const canvas = ref(null)
    const ctx = ref(null)
    const cardBg = ref(null)

    const date = new Date()
    const dateText = ref(date.toISOString().split('T')[0].replace(/-/g, '/'))
    const dateYear = ref(date.getFullYear())

    const handleFile = (e) => {
      const reader = new FileReader()
      input.value.file = e.target.files[0]
      reader.onload = (ee) => {
        const img = new Image()
        img.onload = () => {
          refresh()
        }
        img.src = ee.target.result
        input.value.avatar = img
      }
      reader.readAsDataURL(e.target.files[0])
    }

    const refresh = () => {
      ctx.value.font = '50px Arial'
      // Clear
      ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
      // Background
      ctx.value.drawImage(cardBg.value, 0, 0)
      // Draw Texts
      colorText(input.value.id, canvas.value.width/2 + 450, 500, 'black', '60px dfkai-sb, KaiTi, stkaiti, 標楷體, 华文楷体, cwTeXKai, Arial, cursive, "Ma Shan Zheng", hkkaikk', 'center')
      colorText(input.value.dep, canvas.value.width/2 + 450, 670, 'black', '120px dfkai-sb, KaiTi, stkaiti, 標楷體, 华文楷体, cwTeXKai, Arial, cursive, "Ma Shan Zheng", hkkaikk', 'center')
      colorText(input.value.name, canvas.value.width/2 + 390, 950, 'black', '170px dfkai-sb, KaiTi, stkaiti, 標楷體, 华文楷体, cwTeXKai, Arial, cursive, "Ma Shan Zheng", hkkaikk', 'center')
      // Draw avatar
      if(input.value.avatar) {
        const ratio = 600 / input.value.avatar.width
        ctx.value.save()
        roundedImage(120, 430, 600, input.value.avatar.height * ratio, 30)
        ctx.value.clip()
        ctx.value.drawImage(input.value.avatar, 120, 430, 600, input.value.avatar.height * ratio)
        ctx.value.restore()
      }
    }

    const colorText = (text, x, y, color, font, align) => {
      ctx.value.font = font
      ctx.value.textAlign = align
      ctx.value.fillStyle = color
      ctx.value.fillText(text, x, y)
    }

    const download = () => {
      const link = document.createElement('a')
      link.download = 'Asacoco.png'
      link.href = canvas.value.toDataURL()
      link.click()
    }

    const loadImage = (url) => {
      return new Promise((resolve) => {
        const image = new Image()
        image.onload = () => {
          resolve(image)
        }
        image.src = url
      })
    }

    const roundedImage = (x, y, width, height, radius) => {
      ctx.value.beginPath()
      ctx.value.moveTo(x + radius, y)
      ctx.value.lineTo(x + width - radius, y)
      ctx.value.quadraticCurveTo(x + width, y, x + width, y + radius)
      ctx.value.lineTo(x + width, y + height - radius)
      ctx.value.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
      ctx.value.lineTo(x + radius, y + height)
      ctx.value.quadraticCurveTo(x, y + height, x, y + height - radius)
      ctx.value.lineTo(x, y + radius)
      ctx.value.quadraticCurveTo(x, y, x + radius, y)
      ctx.value.closePath()
    }

    onMounted(async () => {
      await document.fonts.load('10pt "Ma Shan Zheng"')
      await document.fonts.load('10pt cwTeXKai')
      await document.fonts.load('10pt hkkaikk')
      cardBg.value = await loadImage('./images/ACU.png')
      input.value.avatar = await loadImage('./images/default_avatar.png')
      ctx.value = canvas.value.getContext('2d')
      ctx.value.font = '50px Arial'
      refresh()
    })

    return {
      input,
      canvas,
      ctx,
      dateText,
      dateYear,
      handleFile,
      refresh,
      date,
      download
    }
  }
}).mount('#app')
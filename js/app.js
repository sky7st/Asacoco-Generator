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
      colorText(input.value.id, 1200, 500, 'black', '60px cwTeXKai, Arial', 'start')
      colorText(input.value.dep, 1200, 650, 'black', '120px cwTeXKai, Arial', 'center')
      colorText(input.value.name, 1100, 950, 'black', '180px cwTeXKai, Arial', 'center')
      // Draw avatar
      if(input.value.avatar) {
        const ratio = 600 / input.value.avatar.width
        ctx.value.drawImage(input.value.avatar, 150, 450, 600, input.value.avatar.height * ratio)
      }
    }

    const colorText = (text, x, y, color, font, align) => {
      ctx.textAlign = align
      ctx.value.font = font
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

    onMounted(async () => {
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
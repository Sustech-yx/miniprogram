const app = getApp()
const lightSpeed = 299792458 // 单位为 m/s
// 纵坐标单位为s， 横坐标单位为光秒（真空中光在一秒钟内走过的距离）

Page({
  data: {
    speed : 0,
    width_static : 0,
    height_static : 0,
    points_x : [],
    points_y : []
  },
  speed:function (e) {
    console.log(`speed发生change事件，携带值为`, e.detail.value)
    let currentSpeed = e.detail.value.toFixed(3)
    this.setData({
      speed:currentSpeed
    })
  },
  touchstart:function(e) {
    // console.log(e)
    // console.log("x:" + e.touches[0].x)
    // console.log("y:" + e.touches[0].y)
    var x = e.touches[0].x
    var y = e.touches[0].y
    var width = this.data.width_static
    var height = this.data.height_static
    if ((y - height < -(x - width / 2)) && (height - y > -(x - width / 2))) {
      this.data.points_x.push(x - width/2)
      this.data.points_y.push(height - y)
    }
  },
  onLoad() {
    wx.createSelectorQuery()
      .select('#myCanvas')
      .fields({
        node: true,
        size: true,
      })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')

        const dpr = wx.getSystemInfoSync().pixelRatio
        var width
        var height
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        width = res[0].width
        height = res[0].height
        // console.log(dpr)
        // console.log(width)
        // console.log(height)
        ctx.scale(dpr, dpr)
        ctx.translate(width / 2, height)
        this.setData({
          width_static:width,
          height_static:height
        })
        this.drawCoor(ctx, width, height)

        const renderLoop = () => {
          this.render(canvas, ctx, width, height)
          canvas.requestAnimationFrame(renderLoop)
        }
        canvas.requestAnimationFrame(renderLoop)
      })
  },
  render(canvas, ctx, width, height) {
    // ctx.clearRect(-3000, -3000, 3000, 3000)
    this.drawOri(ctx)
    this.drawTra(ctx, width, height)
  },
  drawOri(ctx) {
    var x, y
    for (const i in this.data.points_x) {
      x = this.data.points_x[i]
      y = this.data.points_y[i]
      drawOriginPoint(ctx, x, -y)
    }
    function drawOriginPoint(ctx, x, y) {
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = '#FF0000'
      ctx.strokeStyle = 'rgba(1,1,1,0)'
      ctx.fill()
      ctx.stroke()
    }
  },
  drawTra(ctx, width, height) {
    // drawTranslatedPoint(ctx, -100, -100)
    function drawTranslatedPoint(ctx, x, y) {
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = '#0033FF'
      ctx.strokeStyle = 'rgba(1,1,1,0)'
      ctx.fill()
      ctx.stroke()
    }
  },
  drawCoor(ctx, width, height) {
    ctx.fillText("x", width / 2 - 10, -10)
    ctx.fillText("t", 10, - height + 10)
    // 绘制坐标轴信息
    ctx.lineWidth = 2

    ctx.save()
    ctx.strokeStyle = 'yellow'
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(width / 2, - width / 2)
    ctx.moveTo(0, 0)
    ctx.lineTo(- width / 2, - width / 2)
    ctx.stroke()
    ctx.restore()

    ctx.beginPath()
    ctx.moveTo(- width / 2, 0)
    ctx.lineTo(width / 2, 0)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, - height)
    ctx.stroke()
  }
})

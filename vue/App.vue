<template>
  <div class="progress-outerBox" :style="widthHeight" :class="{ showShadow: progressNum > 60 }" ref="outerBox">
    <svg class="pro-svg">
      <defs>
        <filter id="f1">
          <feGaussianBlur result="Gau1" in="SourceGraphic" stdDeviation="2" />
          <feOffset dx="-4" dy="5" />
          <feGaussianBlur out="Gau2" result="Gau2" stdDeviation="2" />
          <fecomposite in="Gau1" in2="SourceAlpha" operator="in"></fecomposite>
        </filter>
        <!-- 33%进度前渐变颜色 -->
        <linearGradient id="circleColor" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color: #86c1ff" />
          <stop offset="100%" style="stop-color: #2b5bf9" />
        </linearGradient>
        <!-- 66%进度后渐变颜色 -->
        <linearGradient id="circleColorI" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color: #3460f8" />
          <stop offset="100%" style="stop-color: #2b5bf9" />
        </linearGradient>
        <!-- 检查更新条渐变颜色 -->
        <linearGradient id="circleColorII" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :style="{ stopColor: isDark ? '#1A1A1A' : '#E6EAED' }" />
          <stop offset="100%" style="stop-color: #2b5bf9" />
        </linearGradient>
      </defs>

      <!-- 阴影 -->
      <template v-if="state == 2">
        <circle
          :cx="boxR"
          :cy="boxR"
          :r="circleR"
          class="circle circle-filter"
          fill="none"
          :stroke-dasharray="progressNum * ((2 * 3.14 * circleR) / 100) + ' 10000'"
          stroke-width="8%"
          filter="url(#f1)"
        ></circle>
      </template>

      <!-- 底圈 -->
      <circle
        :cx="boxR"
        :cy="boxR"
        :r="circleR"
        class="circle"
        fill="none"
        :stroke-dasharray="2 * 3.14 * circleR + ' 10000'"
        stroke-width="8%"
        :stroke="isDark ? '#1A1A1A' : '#E9EBED'"
      ></circle>
      <!-- 进度条 -->
      <template v-if="state == 2">
        <!-- 阶段二 -->
        <path :d="pathII" stroke-width="8%" class="path-II" v-show="progressNum > 33"></path>
        <!-- 阶段一 -->
        <path :d="pathI" stroke-width="8%" class="path-I" :stroke="progressNum > 5 ? 'url(#circleColor)' : '#2B5BF9'" v-show="progressNum > 0"></path>
        <!-- 阶段三 -->
        <path :d="pathIII" stroke-width="8%" class="path-III" v-show="progressNum > 66"></path>
      </template>
      <!-- 检查更新条 -->
      <template v-if="state == 1">
        <path :d="pathIIII" stroke-width="8%" class="path-IIII"></path>
      </template>
      <!-- 进度显示 -->
      <!-- <template v-if="state == 2">
        <text :x="boxR" :y="boxR + boxR * 0.1" class="text-box">
          <tspan class="text-number">{{ progressNum > 100 ? 100 : parseInt(progressNum) }}</tspan>
          <tspan class="text-symbol">%</tspan>
        </text>
      </template> -->
      <!-- 版本号 -->
      <!-- <text :x="boxR" :y="boxR + boxR * 0.4" class="text-edition">
        {{ version }}
      </text> -->
    </svg>
    <!-- <img :src="iconPath" alt="" class="icon-box" v-if="state < 2" /> -->
  </div>
</template>

<script>
export default {
  name: "progress-bar",
  props: {
    // 更新进度(必须 1-100)
    progressNum: {
      type: Number,
      default: 1,
    },
    // 版本号(必须)
    version: {
      type: String,
      default: "V0.0.0",
    },
    // 状态  0 无状态  1 检查更新  2 下载
    state: {
      type: Number,
      default: 0,
    },
    iconPath: {
      type: String,
      default: "./img/light/ic_arrow_top.png",
    },
    // 基于 宽高为 252px 的大小进行等比缩放（以避免随意改变大小后造成的位置错位）
    multiple: {
      type: Number,
      default: window.document.documentElement.clientWidth > 600 ? 1.4 : 1,
    },
  },
  data() {
    return {
      updataIcon: "",
      isUpdate: false,
      boxR: 0,
      circleR: 0,
      startX: 0,
      startY: 0,
      pathI: "",
      pathII: "",
      pathIII: "",
      pathIIII: "",
      fill: 0,
    };
  },
  computed: {
    isDark() {
      return window.isDark;
    },
    widthHeight() {
      return {
        width: 25.2 * this.multiple + "rem",
        height: 25.2 * this.multiple + "rem",
      };
    },
  },
  watch: {
    progressNum(val) {
      this.getPath(val);
    },
    state: {
      handler(val) {
        console.log("11111111111111111111111111", val);
        let deg = 0;
        if (val == 1) {
          deg = 90;
        } else if (val == 2) {
          this.getPath(this.progressNum);
        }
        let endX = this.startX + this.circleR * Math.sin(((2 * Math.PI) / 360) * deg);
        let endY = this.startY + this.circleR - this.circleR * Math.cos(((2 * Math.PI) / 360) * deg);
        this.pathIIII = `
            M ${this.startX} ${this.startY}
            A ${this.circleR} ${this.circleR} 0 0 1 ${endX} ${endY}`;
      },
      immediate: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      let width = this.$refs.outerBox.clientHeight;
      this.boxR = width / 2;
      this.startX = this.boxR;
      this.startY = this.boxR * 0.2;
      this.circleR = this.boxR - this.boxR * 0.2;
      if (this.progressNum > 0) {
        this.getPath(this.progressNum);
      }
    });

    window.renderProgress = (percent, state) => {
      if (this.state !== 2) {
        this.state = state;
      }

      this.progressNum = percent;
    }
  },
  methods: {
    getPath(number) {
      if (number > 33 && number <= 66) {
        number = number - 33;
      } else if (number > 66) {
        number = number - 66;
      }
      let deg = number * (120 / 33);
      deg = deg > 120 ? 120 : deg;
      if (this.progressNum < 33) {
        this.fill = 0;
        this.fillPathI(deg);
      } else if (this.progressNum > 33 && this.progressNum <= 66) {
        this.fill = 1;
        this.fillPathII(deg);
      } else if (this.progressNum > 66) {
        this.fill = 2;
        this.fillPathIII(deg);
      }
    },
    fillPathI(deg) {
      let endX = this.startX + this.circleR * Math.sin(((2 * Math.PI) / 360) * deg);
      let endY = this.startY + this.circleR - this.circleR * Math.cos(((2 * Math.PI) / 360) * deg);
      this.pathI = `
          M ${this.startX} ${this.startY}
          A ${this.circleR} ${this.circleR} 0 0 1 ${endX} ${endY}`;
    },
    fillPathII(deg) {
      if (this.fill >= 1) {
        this.fillPathI(120);
      }
      let endX = this.startX + this.circleR * Math.sin(((2 * Math.PI) / 360) * deg);
      let endY = this.startY + this.circleR - this.circleR * Math.cos(((2 * Math.PI) / 360) * deg);
      this.pathII = `
          M ${this.startX} ${this.startY}
          A ${this.circleR} ${this.circleR} 0 0 1 ${endX} ${endY}`;
    },
    fillPathIII(deg) {
      if (this.fill >= 2) {
        this.fillPathII(120);
      }
      let endX = this.startX + this.circleR * Math.sin(((2 * Math.PI) / 360) * deg);
      let endY = this.startY + this.circleR - this.circleR * Math.cos(((2 * Math.PI) / 360) * deg);
      this.pathIII = `
          M ${this.startX} ${this.startY}
          A ${this.circleR} ${this.circleR} 0 0 1 ${endX} ${endY}`;
    },
  },
};
</script>

<style lang="less" scoped>
.progress-outerBox {
  position: relative;
  .pro-svg {
    width: 100%;
    height: 100%;
    .circle {
      // stroke: #E9EBED;
      stroke-linecap: round;
    }
    .circle-filter {
      stroke: #86c1ff;
      transform-origin: center center;
      transform: rotate(-90deg);
    }
    .path-I {
      fill: transparent;
      // stroke: url(#circleColor);
      stroke-linecap: round;
    }
    .filter {
      transform-origin: center center;
      transform: rotate(0deg);
    }
    .path-II {
      fill: transparent;
      stroke: #3460f8;
      transform-origin: center center;
      transform: rotate(119deg);
      stroke-linecap: round;
    }
    .path-III {
      fill: transparent;
      stroke: url(#circleColorI);
      transform-origin: center center;
      transform: rotate(239deg);
      stroke-linecap: round;
    }
    .path-IIII {
      fill: transparent;
      stroke: url(#circleColorII);
      transform-origin: center center;
      stroke-linecap: round;
      animation-name: rotateAnimation;
      animation-duration: 3s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
    }
    .text-box {
      text-anchor: middle;
      font-family: HarmonyHeiTi;
      font-weight: 500;
      .text-number {
        font-size: 60px;
        fill: var(--font);
      }
      .text-symbol {
        font-size: 16px;
        fill: var(--font_gray);
      }
    }
    .text-edition {
      text-anchor: middle;
      font-size: 16px;
      font-family: HarmonyHeiTi;
      font-weight: 500;
      line-height: 22px;
      fill: var(--font_gray);
    }
  }
  .icon-box {
    width: 48px;
    height: 48px;
    position: absolute;
    top: calc(50% - 36px);
    left: calc(50% - 24px);
  }
}
@keyframes rotateAnimation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

const VueScrollConf = {
        // vuescroll
        vuescroll: {
            mode: 'native',
            // 设置 vuescroll的大小类型， 可选的有percent, number.
            // 设置为percent会把 vuescroll 的 height 和 width 设置成100%,
            // 设置成number的话 vuescroll 会自动计算父元素的大小，并将height和width设置成对应的数值。
            // 提示:如果父元素的尺寸为百分比大小时建议设置成number,如果父元素大小为一个固定的px的值,那么设置为百分比比较合适一些。
            sizeStrategy: 'percent',
            // 是否开启监听 dom resize
            detectResize: true,
            // 下拉刷新相关(slide mode)
            pullRefresh: {
                enable: false,
                // 下拉刷新的提示
                tips: {
                    deactive: 'Pull to Refresh',
                    active: 'Release to Refresh',
                    start: 'Refreshing...',
                    beforeDeactive: 'Refresh Successfully!'
                }
            },
            // 上推加载相关
            pushLoad: {
                enable: false,
                tips: {
                    deactive: 'Push to Load',
                    active: 'Release to Load',
                    start: 'Loading...',
                    beforeDeactive: 'Load Successfully!'
                },
                auto: false,
                autoLoadDistance: 0
            },
            paging: false,
            zooming: true,
            // 快照
            snapping: {
                enable: false,
                width: 100,
                height: 100
            },
            /* shipped scroll options */
            scroller: {
                /*
                  允许滚动出边界
                  true 或者 false 或者一个数组指定哪个方向可以超出边界，可选项分别是：
                  ['top','bottom','left','right']
                */
                bouncing: [],
                /** Enable locking to the main axis if user moves only slightly on one of them at start */
                locking: true,
                /** 最小缩放级别 */
                minZoom: 0.5,
                /** 最大缩放级别 */
                maxZoom: 3,
                /** 滚动速度的倍速 **/
                speedMultiplier: 1,
                /** 到达边界时应用于减速的改变量  **/
                penetrationDeceleration: 0.03,
                /** 到达边界时应用于加速的改变量  **/
                penetrationAcceleration: 0.08,
                /** Whether call e.preventDefault event when sliding the content or not */
                preventDefault: true,
                /** Whether call preventDefault when (mouse/touch)move*/
                preventDefaultOnMove: true
            }
        },
        scrollPanel: {
            // 组件加载完后的初始滚动量
            initialScrollY: false,
            initialScrollX: false,
            // 是否禁止x或y方向上的滚动
            scrollingX: true,
            scrollingY: true,
            speed: 300,
            // 滚动动画
            easing: undefined,
            // 是否有一个padding样式，样式的大小应该和rail/bar的大小是一样。可以用来阻止内容被滚动条遮住一部分
            padding: false,
            // 有时候原生滚动条可能在左侧,
            // 请查看 https://github.com/YvesCoding/vuescroll/issues/64
            verticalNativeBarPos: 'right'
        },
        //滚动条滚动的地方
        rail: {
            background: '#01a99a',
            opacity:
                0,
            border:
                'none',
            /** Rail's size(Height/Width) , default -> 6px */
            size:
                '6px',
            /** Specify rail's border-radius, or the border-radius of rail and bar will be equal to the rail's size. default -> false **/
            specifyBorderRadius:
                false,
            /** Rail the distance from the two ends of the X axis and Y axis. **/
            gutterOfEnds:
                null,
            /** Rail the distance from the side of container. **/
            gutterOfSide:
                '2px',
            /** Whether to keep rail show or not, default -> false, event content height is not enough */
            keepShow:
                false
        }
        ,
        bar: {
            /** 当不做任何操作时滚动条自动消失的时间 */
            showDelay: 500,
            /** Specify bar's border-radius, or the border-radius of rail and bar will be equal to the rail's size. default -> false **/
            specifyBorderRadius:
                false,
            /** 是否只在滚动的时候现实滚动条 */
            onlyShowBarOnScroll:
                true,
            /** 是否保持显示 */
            keepShow:
                false,
            /** 滚动条颜色, default -> #00a650 */
            background:
                'rgb(3, 185, 118)',
            /** 滚动条透明度, default -> 1  */
            opacity:
                1,
            /** Styles when you hover scrollbar, it will merge into the current style */
            hoverStyle:
                false
        }
        ,
        scrollButton: {
            enable: false,
            background:
                'rgb(3, 185, 118)',
            opacity:
                1,
            step:
                180,
            mousedownStep:
                30
        }
    }
;

export default VueScrollConf;

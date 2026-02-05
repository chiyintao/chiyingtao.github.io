// ===== 示例数据模块 =====
// 包含小王子和窗边的小豆豆的示例章节内容

const SampleData = {
    // 小王子示例章节
    getLittlePrinceChapters() {
        return [
            {
                id: Date.now(),
                title: "我画的第一只羊",
                date: "第1天",
                pageCount: 1,
                content: [
                    `<h1 class="handwritten-h1">我画的第一只羊</h1>
                    <p class="handwritten-p" style="color: #ff6b6b; font-size: 1.2rem;">心情：好奇  地点：撒哈拉沙漠</p>
                    <p class="handwritten-p" style="margin-top: 20px;">请你给我画一只羊......</p>
                    <p class="handwritten-p">当我第一次遇见小王子的时候，我正试图修理我的发动机。这很难，因为我只有一个人。</p>
                    <p class="handwritten-p">他没有问我关于飞机的事，只是想要一只羊。</p>
                    <p class="handwritten-p" style="margin-top: 20px;">我画了一只生病的羊，他不要。</p>
                    <p class="handwritten-p">我画了一只长角的公羊，他也不要。</p>
                    <p class="handwritten-p">他说："这只太老了。我想要一只长寿的羊。"</p>
                    <p class="handwritten-p" style="margin-top: 20px;">最后，我失去了耐心。我画了一个箱子。</p>`
                ]
            },
            {
                id: Date.now() + 1,
                title: "猴面包树的危害",
                date: "第5天",
                pageCount: 1,
                content: [
                    `<h1 class="handwritten-h1">猴面包树的危害</h1>
                    <p class="handwritten-p">事实上，正如我所了解的，在小王子居住的星球上——就像所有星球一样——有好的植物和坏的植物。</p>
                    <p class="handwritten-p">因此，有好植物的好种子，也有坏植物的坏种子。但种子是看不见的。它们沉睡在地球黑暗的心脏深处...</p>
                    <p class="handwritten-p" style="margin-top: 20px; color: #e74c3c;">⚠️ 小王子说：每天早上都要清理猴面包树的幼苗！</p>
                    <p class="handwritten-p">如果不及时清理，它们会长大，把整个星球撑破。</p>`
                ]
            },
            {
                id: Date.now() + 2,
                title: "玫瑰花",
                date: "第8天",
                pageCount: 2,
                content: [
                    `<h1 class="handwritten-h1">骄傲的玫瑰</h1>
                    <p class="handwritten-p">小王子的星球上出现了一朵玫瑰花。</p>
                    <p class="handwritten-p">她是如此美丽，如此骄傲。</p>
                    <p class="handwritten-p" style="color: #e91e63; margin-top: 20px;">"我是世界上最美的花！"她说。</p>
                    <p class="handwritten-p">她要求小王子给她浇水，给她盖玻璃罩，保护她不受风吹。</p>`,
                    `<p class="handwritten-p">小王子很爱她，但她的骄傲让他感到疲惫。</p>
                    <p class="handwritten-p">于是，他决定离开他的星球，去探索宇宙。</p>
                    <p class="handwritten-p" style="margin-top: 20px; font-style: italic;">"再见了，我的玫瑰..."</p>`
                ]
            },
            {
                id: Date.now() + 3,
                title: "狐狸的秘密",
                date: "第21天",
                pageCount: 1,
                content: [
                    `<h1 class="handwritten-h1">驯养</h1>
                    <p class="handwritten-p">在地球上，小王子遇到了一只狐狸。</p>
                    <p class="handwritten-p" style="color: #ff9800; margin-top: 20px;">"请你驯养我吧！"狐狸说。</p>
                    <p class="handwritten-p">"什么是驯养？"小王子问。</p>
                    <p class="handwritten-p">"就是建立联系。"狐狸说，"如果你驯养了我，我们就会彼此需要。"</p>
                    <p class="handwritten-p" style="margin-top: 20px; font-size: 1.3rem; color: #e74c3c;">✨ 只有用心才能看清。本质的东西，眼睛是看不见的。</p>`
                ]
            }
        ];
    },

    // 窗边的小豆豆示例章节
    getTotoChapters() {
        return [
            {
                id: Date.now() + 100,
                title: "第一次来车站",
                date: "春天",
                pageCount: 1,
                content: [
                    `<h1 class="handwritten-h1">巴学园</h1>
                    <p class="handwritten-p">小豆豆第一次来到巴学园的时候，看到了一个奇怪的车站。</p>
                    <p class="handwritten-p">那不是真正的车站，而是用废弃的电车改造成的教室！</p>
                    <p class="handwritten-p" style="color: #9c27b0; margin-top: 20px;">🚃 每个电车就是一个教室！</p>
                    <p class="handwritten-p">小豆豆兴奋极了，她从来没见过这么有趣的学校。</p>
                    <p class="handwritten-p">"我要在这里上学！"她大声说。</p>`
                ]
            },
            {
                id: Date.now() + 101,
                title: "校长先生",
                date: "春天",
                pageCount: 1,
                content: [
                    `<h1 class="handwritten-h1">第一次见面</h1>
                    <p class="handwritten-p">校长先生是一个很特别的人。</p>
                    <p class="handwritten-p">他让小豆豆坐下来，然后说："跟我说说你自己吧。"</p>
                    <p class="handwritten-p" style="margin-top: 20px;">小豆豆说了整整四个小时！</p>
                    <p class="handwritten-p">她说了她的狗洛基，说了她喜欢的燕子，说了她在上一个学校的事情...</p>
                    <p class="handwritten-p" style="color: #4caf50; margin-top: 20px;">校长先生一直认真地听着，从来没有打断她。</p>`
                ]
            },
            {
                id: Date.now() + 102,
                title: "上课",
                date: "春天",
                pageCount: 1,
                content: [
                    `<h1 class="handwritten-h1">自由的课堂</h1>
                    <p class="handwritten-p">在巴学园，上课的方式很特别。</p>
                    <p class="handwritten-p">老师会把一天要学的所有科目的问题都写在黑板上，然后学生们可以从自己喜欢的科目开始学习。</p>
                    <p class="handwritten-p" style="color: #2196f3; margin-top: 20px;">📚 想学什么就学什么！</p>
                    <p class="handwritten-p">小豆豆最喜欢这种上课方式了，因为她可以先做自己喜欢的题目。</p>`
                ]
            },
            {
                id: Date.now() + 103,
                title: "海的味道，山的味道",
                date: "春天",
                pageCount: 1,
                content: [
                    `<h1 class="handwritten-h1">午餐时间</h1>
                    <p class="handwritten-p">巴学园的午餐时间也很特别。</p>
                    <p class="handwritten-p">校长先生要求每个人的便当里都要有"海的味道"和"山的味道"。</p>
                    <p class="handwritten-p" style="margin-top: 20px; color: #00bcd4;">🌊 海的味道：鱼、海带、紫菜...</p>
                    <p class="handwritten-p" style="color: #8bc34a;">⛰️ 山的味道：蔬菜、肉、蘑菇...</p>
                    <p class="handwritten-p" style="margin-top: 20px;">如果谁的便当里缺了什么，校长太太就会从大锅里给他添上。</p>
                    <p class="handwritten-p">这样，每个人都能吃到营养均衡的午餐。</p>`
                ]
            }
        ];
    },

    // 获取示例页面的装饰组件数据
    getLittlePrinceAnnotations() {
        return {
            // 小王子暂不添加预设装饰，让用户自己添加
        };
    },

    getTotoAnnotations() {
        return {
            // 窗边的小豆豆暂不添加预设装饰，让用户自己添加
        };
    }
};

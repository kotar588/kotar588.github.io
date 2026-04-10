---
title: Did you identify all the humour I've packed into the letter?
date: 2026-3-24
summary: No explanation
tags: [misc]
pinned: false
published: false
---

# 1. Random Walks & Dimensionality (Polya's Theorem)

> _"our footsteps are no longer recurrent"_

Pólya's Reccurence Theorem という，ランダムウォークの再帰性に関する定理に基づく．1次元，2次元のランダムウォークでは必ず出発点に戻ってくる（recurrent）が，3次元以上では戻ってこない確率が生まる（transient）．
つまり，それぞれが異なる進路を進むこととその帰結についての比喩である．
この Pólya's Reccurence Theorem の直感的な説明として「A drunk man will find his way home, but a drunk bird may get lost forever.」という有名なジョークがある．
卒業後，本質的な意味での我々の人生が再び交差するというのは無いかもしれないが，我々が空を飛べない限り，時々集まって一緒に酔っ払うことぐらいは十分可能である．

# 2.  PAC Learning (Probably Approximately Correct)

> _"~, which I guarantee probably approximately correctly."_

PAC （確率的で近似的に正しい）は，命題 ~ が「誤差 $\epsilon$ 以内で（Approximately Correct）」かつ「$1-\delta$ 以上の高い確率で（Probably）」成り立つという意味である．
有限回の会話から他人を値踏みし，確定的な結論を出すというのは，あまりに失礼だと思い，$\delta$ 分の保険を掛けた．

# 3.  $\varepsilon$-greedy Strategy

> _"setting the ε in ε-greedy to a larger value (possibly ε >= 1?)"_

強化学習における $\varepsilon$-greedy 法に基づく．これは，これまでの経験で得られた最善の行動をとる「利用（Exploitation）」と，未知の行動を試す「探索（Exploration）」を，確率 $\varepsilon$ に基づいて切り替える手法である．
提案した $\varepsilon \ge 1$ という設定は，「既存の知識や正解を一切無視し，100%の確率で未知の選択肢を選び続ける」 ，もしくはそれ以上の何かという極端な戦略を意味する．
今後の人生において，これまでの定石に縛られることなく，ひたすら新しい世界を探索し続けてほしいという，友人としての過激なエールである．
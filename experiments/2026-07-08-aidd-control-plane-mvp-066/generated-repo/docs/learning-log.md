# Learning Log

公開候補のQAでは、previewファイルを生成しただけでは読者が到達する経路を確認できない。MVP066では公開preview HTMLとassetsをHTTP経路のchecked URLsとして扱い、HTTP status、byte size、content type、latency ms、terminal evidence image responseを同時に見る。

HTMLが200でもassetが404ならfailureにする。HTTP経路未確認、private URL混入、Firefox未確認、terminal evidence image response不足、AIDD-Spec接続不足はblockedとしてReview Findingへ戻す。

Firefoxは遅い場合でも除外しない。Playwrightのtimeout、expect timeout、workers、retriesで安定化する。公開前にはlocal path / host / private network URL混入をdoctor:aiddでfixtureまで検査する。

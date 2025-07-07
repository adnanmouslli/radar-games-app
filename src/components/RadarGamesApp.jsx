import React, { useState, useEffect, useRef } from 'react';
import { Target, Clock, Star, ArrowRight, RotateCcw, Trophy, Play } from 'lucide-react';

const RadarGamesApp = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [gameResults, setGameResults] = useState({});

  // Mouse Target Game State
  const [targetGame, setTargetGame] = useState({
    targets: [],
    score: 0,
    timeLeft: 30,
    isPlaying: false,
    gameStarted: false
  });

  // Counter Game State
  const [counterGame, setCounterGame] = useState({
    counter: 0,
    isRunning: false,
    hasWon: null,
    gameStarted: false
  });

  // Wheel Game State
  const [wheelGame, setWheelGame] = useState({
    isSpinning: false,
    rotation: 0,
    result: null,
    gameStarted: false
  });

  const gameInterval = useRef(null);
  const counterInterval = useRef(null);

  // Mouse Target Game Logic - Made More Difficult
  const startTargetGame = () => {
    setTargetGame({
      targets: [],
      score: 0,
      timeLeft: 30,
      isPlaying: true,
      gameStarted: true
    });

    // Start game timer
    gameInterval.current = setInterval(() => {
      setTargetGame(prev => {
        if (prev.timeLeft <= 1) {
          clearInterval(gameInterval.current);
          // Increased target requirement from 10 to 20 for more difficulty
          const won = prev.score >= 20;
          setGameResults(prevResults => ({
            ...prevResults,
            target: won ? 'win' : 'lose'
          }));
          return { ...prev, timeLeft: 0, isPlaying: false };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    // Generate targets more frequently and disappear faster
    const targetGenerationInterval = setInterval(() => {
      setTargetGame(prev => {
        if (!prev.isPlaying) {
          clearInterval(targetGenerationInterval);
          return prev;
        }
        
        const newTarget = {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20,
          life: 1000 // Reduced from 2000ms to 1000ms
        };
        
        const newTargets = [...prev.targets, newTarget];
        
        // Remove target after 1 second instead of 2
        setTimeout(() => {
          setTargetGame(current => ({
            ...current,
            targets: current.targets.filter(t => t.id !== newTarget.id)
          }));
        }, 1000);
        
        return { ...prev, targets: newTargets };
      });
    }, 400); // Reduced from 800ms to 400ms - targets appear more frequently
  };

  const hitTarget = (targetId) => {
    setTargetGame(prev => ({
      ...prev,
      targets: prev.targets.filter(t => t.id !== targetId),
      score: prev.score + 1
    }));
  };

  // Counter Game Logic - Continuous counting
  const startCounterGame = () => {
    setCounterGame({
      counter: 1,
      isRunning: true,
      hasWon: null,
      gameStarted: true
    });

    // Counter runs continuously and loops back to 1 after 10
    counterInterval.current = setInterval(() => {
      setCounterGame(prev => {
        const nextCounter = prev.counter >= 10 ? 1 : prev.counter + 1;
        return { ...prev, counter: nextCounter };
      });
    }, 100);
  };

  const stopCounter = () => {
    if (counterInterval.current) {
      clearInterval(counterInterval.current);
    }
    
    const won = counterGame.counter === 10;
    setCounterGame(prev => ({
      ...prev,
      isRunning: false,
      hasWon: won
    }));
    
    setGameResults(prevResults => ({
      ...prevResults,
      counter: won ? 'win' : 'lose'
    }));
  };

  // Wheel Game Logic - Updated for random win/lose with lower win probability
  const spinWheel = () => {
    setWheelGame(prev => ({ ...prev, isSpinning: true, gameStarted: true }));
    
    const spinAmount = Math.random() * 3600 + 1800;
    const finalRotation = wheelGame.rotation + spinAmount;
    
    setWheelGame(prev => ({ ...prev, rotation: finalRotation }));
    
    setTimeout(() => {
      // Random win/lose with 20% win probability (reduced from 30%)
      const randomResult = Math.random();
      const won = randomResult < 0.2; // 20% chance to win
      
      setWheelGame(prev => ({
        ...prev,
        isSpinning: false,
        result: won ? 'win' : 'lose',
        finalAngle: finalRotation % 360
      }));
      
      setGameResults(prevResults => ({
        ...prevResults,
        wheel: won ? 'win' : 'lose'
      }));
    }, 5000); // Spin duration 5 seconds
  };

  const resetGame = (gameType) => {
    switch(gameType) {
      case 'target':
        setTargetGame({
          targets: [],
          score: 0,
          timeLeft: 30,
          isPlaying: false,
          gameStarted: false
        });
        break;
      case 'counter':
        if (counterInterval.current) {
          clearInterval(counterInterval.current);
        }
        setCounterGame({
          counter: 0,
          isRunning: false,
          hasWon: null,
          gameStarted: false
        });
        break;
      case 'wheel':
        setWheelGame({
          isSpinning: false,
          rotation: 0,
          result: null,
          gameStarted: false
        });
        break;
    }
  };

  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #ff6b4a 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #ff6b4a 0%, transparent 50%)`
        }}></div>
      </div>

      <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 max-w-5xl w-full text-center border border-slate-700/50 shadow-2xl">
        {/* Logo and Title */}
        <div className="mb-8">
          {/* Logo Container with Radar Design */}
          <div className="relative w-40 h-40 mx-auto mb-6">
               <img src="http://localhost:5174/radar-1.png" alt="radar-1.png" />                    
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-4 tracking-wide">
            🎉 مرحباً بكم في انطلاق تطبيق 
            <span className="text-red-500"> رادار</span>
          </h1>
          <p className="text-xl text-slate-300 mb-6 leading-relaxed">
            استمتع بألعاب تفاعلية مذهلة واربح جوائز رائعة!
          </p>
          <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-2xl p-4 mb-8 border border-red-500/30">
            <p className="text-white text-lg">
              🎮 المشرف سيراقب نقاطك ويسمح لك باللعب
            </p>
          </div>
        </div>

        {/* Games Selection */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="group bg-slate-800/60 rounded-2xl p-6 hover:bg-slate-700/60 transition-all duration-300 cursor-pointer border border-slate-600/50 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/10"
               onClick={() => setCurrentScreen('target')}>
            <div className="bg-gradient-to-br from-red-500 to-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">🎯 اضرب الهدف</h3>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">أصب 20 هدف خلال 30 ثانية</p>
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              سعر اللعبة: 25 نقطة
            </div>
          </div>

          <div className="group bg-slate-800/60 rounded-2xl p-6 hover:bg-slate-700/60 transition-all duration-300 cursor-pointer border border-slate-600/50 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/10"
               onClick={() => setCurrentScreen('counter')}>
            <div className="bg-gradient-to-br from-red-500 to-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">⏱️ العداد السريع</h3>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">أوقف العداد على الرقم 10</p>
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              سعر اللعبة: 50 نقطة
            </div>
          </div>

          <div className="group bg-slate-800/60 rounded-2xl p-6 hover:bg-slate-700/60 transition-all duration-300 cursor-pointer border border-slate-600/50 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/10"
               onClick={() => setCurrentScreen('wheel')}>
            <div className="bg-gradient-to-br from-red-500 to-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">🎯 عجلة الحظ</h3>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">ادر العجلة واربح الجائزة</p>
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              سعر اللعبة: 35 نقطة
            </div>
          </div>
        </div>
      </div>
    </div>
  );


  const TargetGameScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-orange-500 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => setCurrentScreen('home')} 
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all">
              ← العودة للرئيسية
            </button>
            <div className="text-white text-right">
              <p className="text-yellow-300 font-bold">سعر اللعبة: 25 نقطة</p>
            </div>
          </div>
          
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">🎯 لعبة اضرب الهدف</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/20 rounded-lg p-4">
                <p className="text-lg">النقاط: {targetGame.score}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <p className="text-lg">الوقت: {targetGame.timeLeft}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <p className="text-lg">الهدف: 20</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20"
             style={{ height: '500px' }}>
          {!targetGame.gameStarted ? (
            <div className="flex items-center justify-center h-full">
              <button onClick={startTargetGame}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-2xl text-xl font-bold transition-all">
                <Play className="w-6 h-6 inline mr-2" />
                ابدأ اللعبة
              </button>
            </div>
          ) : (
            <>
              {targetGame.targets.map(target => (
                <div key={target.id}
                     className="absolute w-10 h-10 bg-red-500 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform flex items-center justify-center text-white font-bold animate-pulse"
                     style={{ left: `${target.x}%`, top: `${target.y}%` }}
                     onClick={() => hitTarget(target.id)}>
                  🎯
                </div>
              ))}
              
              {!targetGame.isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="bg-white rounded-2xl p-8 text-center">
                    {gameResults.target === 'win' ? (
                      <div className="text-green-600">
                        <Trophy className="w-16 h-16 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">🎉 مبروك!</h3>
                        <p>لقد فزت! أصبت {targetGame.score} هدف</p>
                      </div>
                    ) : (
                      <div className="text-red-600">
                        <h3 className="text-2xl font-bold mb-2">😔 للأسف</h3>
                        <p>لم تصل للهدف. أصبت {targetGame.score} هدف فقط من أصل 20</p>
                      </div>
                    )}
                    <button onClick={() => resetGame('target')}
                            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
                      لعب مرة أخرى
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  const CounterGameScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-500 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => setCurrentScreen('home')} 
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all">
              ← العودة للرئيسية
            </button>
            <div className="text-white text-right">
              <p className="text-green-300 font-bold">سعر اللعبة: 50 نقطة</p>
            </div>
          </div>
          
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">⏱️ لعبة العداد السريع</h2>
            <p className="text-lg mb-6">اضغط "إيقاف" عندما يصل العداد إلى الرقم 10 بالضبط!</p>
            <p className="text-sm mb-4 text-yellow-300">العداد يعد بشكل مستمر من 1 إلى 10 ثم يعود إلى 1</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 text-center border border-white/20">
          {!counterGame.gameStarted ? (
            <div>
              <button onClick={startCounterGame}
                      className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl text-xl font-bold transition-all">
                <Play className="w-6 h-6 inline mr-2" />
                ابدأ اللعبة
              </button>
            </div>
          ) : (
            <div>
              <div className="text-8xl font-bold text-white mb-8 animate-pulse">
                {counterGame.counter}
              </div>
              
              {counterGame.isRunning && (
                <button 
                  onMouseDown={stopCounter}
                  onTouchStart={stopCounter}
                  className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-12 py-6 rounded-2xl text-2xl font-bold transition-all animate-bounce select-none touch-manipulation"
                  style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
                  إيقاف!
                </button>
              )}
              
              {counterGame.hasWon !== null && (
                <div className="mt-8">
                  {counterGame.hasWon ? (
                    <div className="text-green-400">
                      <Trophy className="w-16 h-16 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">🎉 مبروك!</h3>
                      <p>لقد فزت! أوقفت العداد على الرقم 10</p>
                    </div>
                  ) : (
                    <div className="text-red-400">
                      <h3 className="text-2xl font-bold mb-2">😔 للأسف</h3>
                      <p>أوقفت العداد على الرقم {counterGame.counter}</p>
                    </div>
                  )}
                  <button onClick={() => resetGame('counter')}
                          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
                    لعب مرة أخرى
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const WheelGameScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-4">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setCurrentScreen('home')} 
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all">
            ← العودة للرئيسية
          </button>
          <div className="text-white text-right">
            <p className="text-pink-300 font-bold">سعر اللعبة: 35 نقطة</p>
          </div>
        </div>
        
        <div className="text-center text-white">
          <h2 className="text-3xl font-bold mb-4">🎯 عجلة الحظ</h2>
          <p className="text-lg mb-6">ادر العجلة واختبر حظك!</p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 text-center border border-white/20">
        <div className="relative mb-8">
          <div className="w-80 h-80 mx-auto relative">
            {/* Wheel - static background */}
            <div className="w-full h-full rounded-full border-8 border-white"
                 style={{ 
                   background: 'conic-gradient(#8b5cf6 0deg 60deg, #ec4899 60deg 120deg, #f59e0b 120deg 180deg, #22c55e 180deg 240deg, #ef4444 240deg 300deg, #06b6d4 300deg 360deg)'
                 }}>
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Spinning logo in center */}
                <div className={`w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg transition-transform duration-5000 ease-out`}
                     style={{ transform: `rotate(${wheelGame.rotation}deg)` }}>
                    <img src="http://localhost:5174/radar-1.png" alt="radar-1.png" />                    
                </div>
              </div>
            </div>
          </div>
        </div>

        {!wheelGame.gameStarted ? (
          <button onClick={spinWheel}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-2xl text-xl font-bold transition-all">
            <Play className="w-6 h-6 inline mr-2" />
            ادر العجلة
          </button>
        ) : (
          <div>
            {wheelGame.isSpinning ? (
              <p className="text-white text-xl animate-pulse">العجلة تدور... 🎯</p>
            ) : wheelGame.result && (
              <div className="mt-8">
                {wheelGame.result === 'win' ? (
                  <div className="text-green-400">
                    <Trophy className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">🎉 مبروك!</h3>
                    <p>لقد فزت بالجائزة!</p>
                  </div>
                ) : (
                  <div className="text-yellow-400">
                    <h3 className="text-2xl font-bold mb-2">🍀 حظ أوفر</h3>
                    <p>لم تفز هذه المرة، جرب مرة أخرى!</p>
                  </div>
                )}
                <button onClick={() => resetGame('wheel')}
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
                  لعب مرة أخرى
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);

  // Cleanup intervals
  useEffect(() => {
    return () => {
      if (gameInterval.current) clearInterval(gameInterval.current);
      if (counterInterval.current) clearInterval(counterInterval.current);
    };
  }, []);

  return (
    <div className="font-arabic">
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'target' && <TargetGameScreen />}
      {currentScreen === 'counter' && <CounterGameScreen />}
      {currentScreen === 'wheel' && <WheelGameScreen />}
    </div>
  );
};

export default RadarGamesApp;
// export function CurrentRank(){
//     return (
//         <div className="w-full space-y-6">
//                 {/* Current Rank Card */}
//                 <div className="card-premium rounded-lg shadow-lg p-6">
//                     <h1 className="text-3xl font-bold mb-6 text-pm-gold-500">Your Rank</h1>

//                     <div className={`bg-gradient-to-r ${currentRank.color} rounded-lg p-6 text-white mb-6`}>
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <div className="text-5xl mb-2">{currentRank.icon}</div>
//                                 <h2 className="text-3xl font-bold">{currentRank.name}</h2>
//                                 <p className="text-sm opacity-90 mt-1">
//                                     Current Investment: ${userInvestment.toFixed(2)}
//                                 </p>
//                             </div>
//                         </div>

//                         <div className="mt-4">
//                             <h3 className="font-semibold mb-2">Your Benefits:</h3>
//                             <ul className="space-y-1">
//                                 {currentRank.benefits.map((benefit, idx) => (
//                                     <li key={idx} className="flex items-center">
//                                         <span className="mr-2">✓</span>
//                                         {benefit}
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                     </div>

//                     {/* Progress to Next Rank */}
//                     {nextRank && (
//                         <div className="p-4 bg-pm-brown-900/50 rounded-lg border border-pm-gold-900/30">
//                             <h3 className="text-lg font-semibold text-pm-gold-500 mb-3">
//                                 Progress to {nextRank.name} {nextRank.icon}
//                             </h3>
//                             <div className="relative w-full bg-pm-char rounded-full h-4 mb-2">
//                                 <div
//                                     className={`bg-gradient-to-r ${nextRank.color} h-4 rounded-full transition-all duration-500`}
//                                     style={{
//                                         width: `${Math.min((userInvestment / nextRank.minInvestment) * 100, 100)}%`
//                                     }}
//                                 />
//                             </div>
//                             <p className="text-sm text-pm-muted">
//                                 ${(nextRank.minInvestment - userInvestment).toFixed(2)} more needed to reach {nextRank.name}
//                             </p>
//                         </div>
//                     )}
//                 </div>
//</div>
//     )
// }
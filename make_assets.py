from pathlib import Path
p=Path(__file__).parent/'public/assets'
base='<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="720" viewBox="0 0 1600 720"><defs><radialGradient id="bg"><stop stop-color="#25323a"/><stop offset="1" stop-color="#10151b"/></radialGradient></defs><rect width="1600" height="720" fill="url(#bg)"/>'
grid=''.join(f'<path d="M{x} 0V720" stroke="#b9cbd4" stroke-opacity=".035"/>' for x in range(0,1600,80))+''.join(f'<path d="M0 {y}H1600" stroke="#b9cbd4" stroke-opacity=".035"/>' for y in range(0,720,80))
s=base+grid+'<g transform="translate(430 105)"><rect width="850" height="500" rx="12" fill="#12191f" stroke="#788d9a" stroke-opacity=".4"/><path d="M0 55H850M200 55V500" stroke="#788d9a" stroke-opacity=".2"/><text x="26" y="34" font-family="Arial" font-size="14" fill="#b1bfca" letter-spacing="4">CENTRAL / OPERATIONS</text><circle cx="815" cy="28" r="4" fill="#c9b88e"/>'
for i,t in enumerate(['OVERVIEW','DEPARTMENTS','RESOURCES','EVENT LOG']):
 s+=f'<text x="26" y="{105+i*52}" font-family="Arial" font-size="11" fill="#8195a4" letter-spacing="2">{t}</text>'
s+='<text x="236" y="100" font-family="Arial" font-size="12" fill="#bdc7ce" letter-spacing="3">SYSTEM ARCHITECTURE</text>'
for n,(x,y) in enumerate([(330,195),(690,195),(330,405),(690,405)]):
 s+=f'<path d="M510 300L{x} {y}" stroke="#c9b88e" stroke-opacity=".5"/><rect x="{x-62}" y="{y-28}" width="124" height="56" rx="5" fill="#202d35" stroke="#536975"/><circle cx="{x-43}" cy="{y}" r="4" fill="#c9b88e"/><text x="{x-25}" y="{y+4}" font-family="Arial" font-size="10" fill="#a5b8c6">MODULE / {n+1}</text>'
s+='<circle cx="510" cy="300" r="73" fill="#142129" stroke="#c9b88e"/><circle cx="510" cy="300" r="86" fill="none" stroke="#b9cbd4" stroke-opacity=".15"/><text x="510" y="295" text-anchor="middle" font-family="Arial" font-size="15" fill="#d7c69b" letter-spacing="4">ANGELA</text><text x="510" y="319" text-anchor="middle" font-family="Arial" font-size="9" fill="#6c8798" letter-spacing="3">CONTROL CORE</text></g><text x="110" y="540" font-family="Georgia" font-size="100" fill="#c9b88e" opacity=".5">01</text><text x="115" y="580" font-family="Arial" font-size="12" fill="#7b909e" letter-spacing="4">ORDER IN COMPLEXITY</text></svg>'
p.joinpath('central.svg').write_text(s)
s=base+grid+'<g transform="translate(480 95)"><rect width="850" height="530" rx="5" fill="#14171a" stroke="#746a54" stroke-opacity=".5"/><text x="35" y="46" font-family="Georgia" font-size="23" fill="#d7c9a6" letter-spacing="5">THE LIBRARY</text><text x="610" y="45" font-family="Arial" font-size="10" fill="#887f6a" letter-spacing="3">KNOWLEDGE / ARCHIVE</text><path d="M30 70H820" stroke="#746a54" stroke-opacity=".4"/>'
for row in range(3):
 for col in range(7):
  x,y=42+col*112,100+row*124
  color=['242b2e','2b2b27','2f302c','232b32'][(row+col)%4]
  s+=f'<rect x="{x}" y="{y}" width="91" height="99" rx="2" fill="#{color}" stroke="#b0a789" stroke-opacity=".2"/><path d="M{x+12} {y+15}V{y+83}" stroke="#c9b88e" stroke-opacity=".5"/><text x="{x+26}" y="{y+30}" fill="#c2b38d" font-family="Georgia" font-size="20">{row*7+col+1:02}</text><path d="M{x+26} {y+55}h43m-43 8h32m-32 8h39" stroke="#857c64" stroke-opacity=".6"/>'
s+='<path d="M30 485H820" stroke="#746a54" stroke-opacity=".4"/><text x="40" y="510" fill="#8c8370" font-family="Arial" font-size="10" letter-spacing="3">COLLECT / CLASSIFY / PRESERVE / RETRIEVE</text></g><text x="110" y="360" font-family="Georgia" font-size="120" fill="#c9b88e" opacity=".55">02</text><text x="116" y="402" font-family="Arial" font-size="12" fill="#8d8879" letter-spacing="4">A SYSTEM OF KNOWLEDGE</text></svg>'
p.joinpath('library.svg').write_text(s)
p.joinpath('hero.svg').write_text(base+grid+'<circle cx="1150" cy="360" r="240" fill="none" stroke="#c9b88e" stroke-opacity=".2"/><circle cx="1150" cy="360" r="190" fill="none" stroke="#c9b88e" stroke-opacity=".1"/></svg>')

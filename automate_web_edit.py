import re, os

html_files = [
    "Misitioweb/contacto.html",
    "Misitioweb/index.html",
    "Misitioweb/fotos.html",
    "Misitioweb/videos.html"
]

solo_instagram = '''
<div class="text-center my-8">
  <h2 class="text-2xl font-bold mb-2">Sígueme en redes sociales</h2>
  <p class="mb-4">Mantente al tanto de mis últimos trabajos y proyectos</p>
  <a href="https://www.instagram.com/romppao?igsh=dW42aHJvb3hvY2g0" target="_blank" rel="noopener" aria-label="Instagram" style="display:inline-block;">
    <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
      <rect width="40" height="40" rx="12" fill="#23272F"/>
      <path d="M26.667 14.308c0-.73-.594-1.323-1.323-1.323h-10.687c-.729 0-1.323.593-1.323 1.323v10.691c0 .73.594 1.323 1.323 1.323h10.687c.729 0 1.323-.593 1.323-1.323V14.308zm-7.333 2.99a3.333 3.333 0 1 1 0 6.667 3.333 3.333 0 0 1 0-6.667zm5.625-.833a.833.833 0 1 1 0-1.667.833.833 0 0 1 0 1.667zm-5.625 1.667A2.083 2.083 0 1 0 20 21.417a2.083 2.083 0 0 0-2.083-2.083z" fill="#fff"/>
    </svg>
  </a>
</div>
'''

def limpia_redes_sociales(html):
    patron = re.compile(
        r'<div[^>]*class="[^"]*(social|redes)[^"]*"[^>]*>.*?</div>',
        re.DOTALL | re.IGNORECASE
    )
    html_nuevo = patron.sub(solo_instagram, html)
    return html_nuevo

def reemplaza_texto(html, texto_original, texto_nuevo):
    return html.replace(texto_original, texto_nuevo)

for ruta in html_files:
    if not os.path.isfile(ruta):
        continue
    with open(ruta, "r", encoding="utf-8") as f:
        contenido = f.read()
    contenido = limpia_redes_sociales(contenido)
    # Ejemplo:
    # contenido = reemplaza_texto(contenido, "Texto antiguo", "Texto nuevo")
    with open(ruta, "w", encoding="utf-8") as f:
        f.write(contenido)

print("Automatización completada: Solo Instagram está en redes sociales.")

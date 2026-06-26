import re
import json

mapeo_path = '/Users/fe/Desktop/Codes/Dra_Gabriela-main/mapeo-endometriosis.html'

with open(mapeo_path, 'r', encoding='utf-8') as f:
    content = f.read()

# The user's new JSON
new_json_str = '''{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cómo saber si tengo endometriosis?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El diagnóstico de la endometriosis se basa en una combinación de evaluación clínica y estudios de imagen especializados. Inicialmente, el médico especialista evalúa los síntomas, como el dolor pélvico intenso o las molestias durante las relaciones sexuales, y realiza una exploración física. Sin embargo, para confirmar la presencia y extensión de las lesiones, el método no invasivo más recomendado es el mapeo endometriósico por ultrasonido, el cual permite visualizar implantes, adherencias y la posible afectación de otros órganos."
      }
    },
    {
      "@type": "Question",
      "name": "¿El cólico menstrual fuerte es normal?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, un cólico menstrual que resulta incapacitante no es normal. Aunque durante mucho tiempo se ha normalizado el dolor durante la menstruación, si este dolor te obliga a suspender tus actividades diarias, no mejora con analgésicos comunes o empeora con el tiempo, es una señal de alerta. Este tipo de dolor severo es uno de los síntomas principales de la endometriosis y debe ser evaluado por un especialista."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuáles son los primeros síntomas de la endometriosis?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Los síntomas iniciales suelen incluir cólicos menstruales muy dolorosos (dismenorrea ) que pueden comenzar antes de la regla y durar varios días. Otros síntomas tempranos son el dolor profundo durante o después de las relaciones sexuales, dolor en la zona lumbar o pélvica, y molestias al orinar o defecar, especialmente durante el periodo menstrual."
      }
    },
    {
      "@type": "Question",
      "name": "¿La endometriosis tiene cura?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Actualmente, la endometriosis no tiene una cura definitiva. Es una enfermedad crónica, pero existen tratamientos muy eficaces para controlar los síntomas, mejorar la calidad de vida y preservar la fertilidad. El tratamiento puede incluir medicamentos hormonales, analgésicos y, en casos más avanzados o de endometriosis profunda, cirugía especializada para extirpar las lesiones."
      }
    },
    {
      "@type": "Question",
      "name": "¿Puedo embarazarme si tengo endometriosis?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, muchas mujeres con endometriosis logran embarazarse. Aunque la enfermedad puede dificultar la concepción en algunos casos, especialmente si afecta las trompas de Falopio o los ovarios, no es sinónimo de infertilidad absoluta. Un diagnóstico temprano y un tratamiento adecuado, guiado por estudios como el mapeo endometriósico, mejoran significativamente las posibilidades de lograr un embarazo."
      }
    },
    {
      "@type": "Question",
      "name": "¿La endometriosis es hereditaria?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Existe evidencia de que la endometriosis tiene un componente genético. Las mujeres con antecedentes familiares de primer grado, como una madre o hermana con endometriosis, tienen una mayor probabilidad de desarrollar la enfermedad. Aunque el patrón de herencia es complejo y no garantiza su aparición, es un factor de riesgo importante que el médico debe considerar."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué diferencia hay entre el mapeo de endometriosis y una ecografía normal?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Una ecografía pélvica o transvaginal convencional se enfoca principalmente en evaluar el útero y los ovarios. En contraste, el mapeo endometriósico es un estudio mucho más exhaustivo y dirigido. Requiere preparación intestinal y evalúa sistemáticamente compartimentos adicionales de la pelvis, como la vejiga, los uréteres, el intestino (recto y colon sigmoides) y los ligamentos uterinos, permitiendo detectar la endometriosis profunda que una ecografía normal no puede ver."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta un mapeo de endometriosis en México?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El costo del mapeo endometriósico en México puede variar dependiendo de la clínica, la ciudad y la tecnología utilizada (ultrasonido 2D/3D o resonancia magnética). En general, es un estudio especializado que requiere equipos de alta resolución y médicos con entrenamiento específico en endometriosis, por lo que su valor refleja esta especialización. Es recomendable consultar directamente con el centro de diagnóstico para obtener información precisa sobre precios y preparación."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cómo puedo aliviar el dolor de la endometriosis?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El alivio del dolor debe ser guiado por un médico especialista e incluye opciones como analgésicos, antiinflamatorios y terapias hormonales (como anticonceptivos) para reducir la inflamación y el sangrado. Además del tratamiento médico, muchas pacientes encuentran alivio complementario mediante cambios en el estilo de vida, como adoptar una dieta antiinflamatoria, realizar ejercicio moderado y aplicar calor local en la zona pélvica."
      }
    }
  ]
}'''

new_faq_data = json.loads(new_json_str)

# Build HTML
html_snippets = []
for q in new_faq_data["mainEntity"]:
    html_snippets.append(f"""                <div class=\"faq-item\">
                    <h3 style=\"margin: 0; padding: 0; font-size: inherit; font-weight: inherit;\">
                        <button class=\"faq-question\" aria-expanded=\"false\">
                            {q['name']}
                            <i class=\"fas fa-chevron-down\"></i>
                        </button>
                    </h3>
                    <div class=\"faq-answer\">
                        <p>{q['acceptedAnswer']['text']}</p>
                    </div>
                </div>""")

new_html_items = "\n".join(html_snippets)

# Find where to inject in HTML
# The end of the faq-container is marked by the closing </div> of the last faq-item, before </div> <!-- End faq-container -->
# Let's just locate the </div>\n            </div>\n        </div>\n    </section>\n\n    <!-- Banner -->
# Or simply find `<div class="faq-container">` and its closing tag.
# We will just append the new items right before the closing `</div>` of the `.faq-container`
container_start = content.find('<div class=\"faq-container\">')
if container_start != -1:
    # find the closing div of this container. It's preceded by the last item's </div>
    # A safer way: find `</section>` of the FAQ section and work backwards.
    faq_section_start = content.find('<section class=\"section\" id=\"faq\">')
    faq_section_end = content.find('</section>', faq_section_start)
    
    # Within this section, the last </div> before </section> is the container's closing div, 
    # but there's a </div> for container, </div> for section-wrapper maybe.
    # Let's just do a string replacement on a known anchor
    anchor = '''                </div>
            </div>
        </div>
    </section>

    <!-- Banner Final -->'''
    if anchor in content:
        content = content.replace(anchor, f'''                </div>
{new_html_items}
            </div>
        </div>
    </section>

    <!-- Banner Final -->''')

# Now update JSON-LD
# Extract the old FAQPage json-ld
pattern = r'<script type=\"application/ld\+json\">\s*\{\s*\"\@context\":\s*\"https://schema\.org\",\s*\"\@type\":\s*\"FAQPage\".*?</script>'
match = re.search(pattern, content, re.DOTALL)

if match:
    old_script = match.group(0)
    # Extract the JSON part
    json_str = old_script.replace('<script type=\"application/ld+json\">', '').replace('</script>', '').strip()
    try:
        old_data = json.loads(json_str)
        # Merge questions
        if "mainEntity" in old_data:
            old_data["mainEntity"].extend(new_faq_data["mainEntity"])
        
        merged_script = '<script type=\"application/ld+json\">\n' + json.dumps(old_data, indent=2, ensure_ascii=False) + '\n    </script>'
        content = content.replace(old_script, merged_script)
    except json.JSONDecodeError:
        print("Could not parse old FAQ JSON-LD")
else:
    # If not found, just append the new JSON LD before closing head
    print("Old FAQ JSON-LD not found, injecting the new one...")
    content = content.replace('</head>', f'<script type=\"application/ld+json\">\n{new_json_str}\n</script>\n</head>')

with open(mapeo_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("FAQ updated successfully.")

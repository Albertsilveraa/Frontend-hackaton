export const courseTrees: Record<string, any> = {
  'from-mockup-to-market': [ // Inglés
    {
      label: 'Curso de Inglés - 18 Semanas',
      icon: 'i-ph-book-duotone',
      defaultExpanded: true,
      children: [
        {
          label: 'Semana 1-3: Fundamentos básicos',
          icon: 'i-fluent-emoji-sparkles',
          children: [
            { label: 'Saludos y presentaciones', icon: 'i-twemoji-wave' },
            { label: 'Verbos y estructuras simples', icon: 'i-mdi-alpha-v-circle' }
          ]
        },
        {
          label: 'Semana 4: Examen 1',
          icon: 'i-mdi-file-document-edit-outline',
          children: [
            { label: 'Evaluación de lo aprendido en semanas 1-3', icon: 'i-mdi-checkbox-marked-circle-outline' }
          ]
        },
        {
          label: 'Semana 5-7: Expresiones y vocabulario',
          icon: 'i-mdi-file-document-edit-outline',
          children: [
            { label: 'Conversaciones cotidianas', icon: 'i-mdi-chat-processing-outline' },
            { label: 'Vocabulario de la universidad', icon: 'i-mdi-school-outline' }
          ]
        },
        {
          label: 'Semana 8: Examen 2',
          icon: 'i-mdi-file-document-edit-outline',
          children: [
            { label: 'Evaluación de semanas 5-7', icon: 'i-mdi-checkbox-marked-circle-outline' }
          ]
        },
        {
          label: 'Semana 9-11: Comprensión lectora y auditiva',
          icon: 'i-ph-headphones-duotone',
          children: [
            { label: 'Lecturas cortas y comprensión', icon: 'i-mdi-book-open-page-variant-outline' },
            { label: 'Práctica de listening', icon: 'i-mdi-ear-hearing' }
          ]
        },
        {
          label: 'Semana 12: Examen 3',
          icon: 'i-mdi-file-document-edit-outline',
          children: [
            { label: 'Evaluación de semanas 9-11', icon: 'i-mdi-checkbox-marked-circle-outline' }
          ]
        },
        {
          label: 'Semana 13-15: Gramática intermedia',
          icon: 'i-mdi-format-list-bulleted-type',
          children: [
            { label: 'Tiempos verbales', icon: 'i-mdi-clock-time-four-outline' },
            { label: 'Conectores y frases complejas', icon: 'i-mdi-link-variant' }
          ]
        },
        {
          label: 'Semana 16: Examen 4',
          icon: 'i-mdi-file-document-edit-outline',
          children: [
            { label: 'Evaluación de semanas 13-15', icon: 'i-mdi-checkbox-marked-circle-outline' }
          ]
        },
        {
          label: 'Semana 17-18: Repaso y proyecto final',
          icon: 'i-mdi-star-shooting-outline',
          children: [
            { label: 'Actividades integradoras', icon: 'i-mdi-trophy-outline' },
            { label: 'Preparación para el cierre del curso', icon: 'i-mdi-flag-checkered' }
          ]
        }
      ]
    }
  ],

  'how-i-built-my-own-design-system-from-scratch': [ // Matemática General
    {
      label: 'Curso de Matemática General',
      icon: 'i-mdi-function-variant',
      defaultExpanded: true,
      children: [
        {
          label: 'Semana 1-3: Álgebra básica',
          icon: 'i-mdi-numeric-1-box-multiple',
          children: [
            { label: 'Números reales y operaciones', icon: 'i-mdi-numeric' },
            { label: 'Ecuaciones y desigualdades', icon: 'i-mdi-equalizer-outline' }
          ]
        },
        {
          label: 'Semana 4: Examen 1',
          icon: 'i-mdi-file-document-edit-outline',
          children: [
            { label: 'Resolución de problemas algebraicos', icon: 'i-mdi-checkbox-marked-circle-outline' }
          ]
        },
        {
          label: 'Semana 5-7: Funciones',
          icon: 'i-mdi-function-variant',
          children: [
            { label: 'Gráficas y tipos de funciones', icon: 'i-mdi-chart-line-variant' },
            { label: 'Propiedades y aplicaciones', icon: 'i-mdi-cogs' }
          ]
        },
        {
          label: 'Semana 8: Examen 2',
          icon: 'i-mdi-file-document-edit-outline',
          children: [
            { label: 'Evaluación de funciones', icon: 'i-mdi-checkbox-marked-circle-outline' }
          ]
        },
        {
          label: 'Semana 9-11: Trigonometría',
          icon: 'i-mdi-sine-wave',
          children: [
            { label: 'Razones trigonométricas', icon: 'i-mdi-angle-acute' },
            { label: 'Ecuaciones trigonométricas', icon: 'i-mdi-epsilon' }
          ]
        },
        {
          label: 'Semana 12: Examen 3',
          icon: 'i-mdi-file-document-edit-outline',
          children: [
            { label: 'Evaluación de trigonometría', icon: 'i-mdi-checkbox-marked-circle-outline' }
          ]
        },
        {
          label: 'Semana 13-15: Geometría y sistemas',
          icon: 'i-mdi-shape-outline',
          children: [
            { label: 'Geometría analítica', icon: 'i-mdi-ruler-square-compass' },
            { label: 'Sistemas de ecuaciones', icon: 'i-mdi-table-row-plus-before0' }
          ]
        },
        {
          label: 'Semana 16: Examen 4',
          icon: 'i-mdi-file-document-edit-outline',
          children: [
            { label: 'Evaluación de geometría y álgebra avanzada', icon: 'i-mdi-checkbox-marked-circle-outline' }
          ]
        },
        {
          label: 'Semana 17-18: Repaso y proyecto final',
          icon: 'i-mdi-lightbulb-on-outline',
          children: [
            { label: 'Repaso general', icon: 'i-mdi-book-refresh-outline' },
            { label: 'Proyecto integrador', icon: 'i-mdi-star-outline' }
          ]
        }
      ]
    }
  ],

  'psychology-of-color-in-ui-design': [ // Física General
    {
      label: 'Curso de Física General',
      icon: 'i-mdi-atom-variant',
      defaultExpanded: true,
      children: [
        {
          label: 'Semana 1-3: Magnitudes y vectores',
          icon: 'i-mdi-vector-line',
          children: [
            { label: 'Unidades y sistemas de medida', icon: 'i-mdi-ruler' },
            { label: 'Operaciones con vectores', icon: 'i-mdi-arrow-expand-all' }
          ]
        },
        {
          label: 'Semana 4: Examen 1',
          icon: 'i-mdi-file-document-edit-outline',
          children: [
            { label: 'Cinemática y vectores', icon: 'i-mdi-checkbox-marked-circle-outline' }
          ]
        },
        {
          label: 'Semana 5-7: Dinámica y leyes de Newton',
          icon: 'i-mdi-rocket-launch-outline',
          children: [
            { label: 'Leyes de Newton', icon: 'i-mdi-arrow-right-bold-outline' },
            { label: 'Aplicaciones de dinámica', icon: 'i-mdi-cog-play-outline' }
          ]
        },
        {
          label: 'Semana 8: Examen 2',
          icon: 'i-mdi-file-document-edit-outline',
          children: [
            { label: 'Evaluación de dinámica', icon: 'i-mdi-checkbox-marked-circle-outline' }
          ]
        },
        {
          label: 'Semana 9-11: Trabajo y energía',
          icon: 'i-mdi-battery-charging-high',
          children: [
            { label: 'Trabajo y potencia', icon: 'i-mdi-run-fast' },
            { label: 'Energía y conservación', icon: 'i-mdi-infinity' }
          ]
        },
        {
          label: 'Semana 12: Examen 3',
          icon: 'i-mdi-file-document-edit-outline',
          children: [
            { label: 'Evaluación de energía', icon: 'i-mdi-checkbox-marked-circle-outline' }
          ]
        },
        {
          label: 'Semana 13-15: Ondas y óptica',
          icon: 'i-mdi-waveform',
          children: [
            { label: 'Ondas y sonido', icon: 'i-mdi-wave' },
            { label: 'Principios de óptica', icon: 'i-mdi-glasses' }
          ]
        },
        {
          label: 'Semana 16: Examen 4',
          icon: 'i-mdi-file-document-edit-outline',
          children: [
            { label: 'Evaluación de ondas y óptica', icon: 'i-mdi-checkbox-marked-circle-outline' }
          ]
        },
        {
          label: 'Semana 17-18: Repaso y proyecto integrador',
          icon: 'i-mdi-lightbulb-multiple-outline',
          children: [
            { label: 'Repaso general', icon: 'i-mdi-book-open-variant' },
            { label: 'Proyecto experimental', icon: 'i-mdi-flask-empty-outline' }
          ]
        }
      ]
    }
  ],

  'slow-design-in-fast-paced-digital-world': [ // Química General
    {
      label: 'Curso de Química General',
      icon: 'i-mdi-flask-round-bottom',
      defaultExpanded: true,
      children: [
        {
          label: 'Semana 1-3: Estructura de la materia',
          icon: 'i-mdi-cube-outline',
          children: [
            { label: 'Estados físicos de la materia', icon: 'i-mdi-water' },
            { label: 'Propiedades y mezclas', icon: 'i-mdi-flask-outline' }
          ]
        },
        {
          label: 'Semana 4: Examen 1',
          icon: 'i-mdi-file-document-edit-outline',
          children: [
            { label: 'Evaluación de estructura y estados', icon: 'i-mdi-checkbox-marked-circle-outline' }
          ]
        },
        {
          label: 'Semana 5-7: Enlaces y compuestos',
          icon: 'i-mdi-chemical-weapon',
          children: [
            { label: 'Enlaces químicos', icon: 'i-mdi-link-variant' },
            { label: 'Composición molecular', icon: 'i-mdi-hexagon-multiple-outline' }
          ]
        },
        {
          label: 'Semana 8: Examen 2',
          icon: 'i-mdi-file-document-edit-outline',
          children: [
            { label: 'Evaluación de enlaces y compuestos', icon: 'i-mdi-checkbox-marked-circle-outline' }
          ]
        },
        {
          label: 'Semana 9-11: Reacciones químicas',
          icon: 'i-mdi-flask-outline',
          children: [
            { label: 'Balanceo y tipos de reacción', icon: 'i-mdi-scale-balance' },
            { label: 'Estequiometría', icon: 'i-mdi-calculator-variant' }
          ]
        },
        {
          label: 'Semana 12: Examen 3',
          icon: 'i-mdi-file-document-edit-outline',
          children: [
            { label: 'Evaluación de reacciones químicas', icon: 'i-mdi-checkbox-marked-circle-outline' }
          ]
        },
        {
          label: 'Semana 13-15: Soluciones, ácidos y bases',
          icon: 'i-mdi-glass-mug-variant',
          children: [
            { label: 'Soluciones', icon: 'i-mdi-water-percent' },
            { label: 'Ácidos y bases', icon: 'i-mdi-flask-round-bottom-empty-outline' }
          ]
        },
        {
          label: 'Semana 16: Examen 4',
          icon: 'i-mdi-file-document-edit-outline',
          children: [
            { label: 'Evaluación de soluciones y química aplicada', icon: 'i-mdi-checkbox-marked-circle-outline' }
          ]
        },
        {
          label: 'Semana 17-18: Repaso y proyecto experimental',
          icon: 'i-mdi-star-shooting-outline',
          children: [
            { label: 'Repaso general', icon: 'i-mdi-book-refresh-outline' },
            { label: 'Proyecto experimental', icon: 'i-mdi-flask-empty-outline' }
          ]
        }
      ]
    }
  ]
}

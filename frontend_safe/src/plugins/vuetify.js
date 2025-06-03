import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'electionTheme',
        themes: {
            electionTheme: {
                dark: false,
                colors: {
                    background: '#f9fafc',
                    surface: '#ffffff',
                    primary: '#1e88e5',
                    secondary: '#42a5f5',
                    info: '#2196f3',
                    success: '#4caf50',
                    warning: '#ffb300',
                    error: '#e53935',
                },
            },
        },
    },
})

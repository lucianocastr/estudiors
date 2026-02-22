import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Política de privacidad y protección de datos personales del estudio jurídico.",
};

export default function PrivacidadPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 pb-8 border-b border-border/50">
            <p className="text-xs tracking-[0.2em] uppercase text-accent/70 mb-2 font-medium">Legal</p>
            <h1 className="font-display text-4xl font-semibold text-foreground">Política de Privacidad</h1>
          </div>
          <div className="prose prose-gray max-w-none">
          <p className="lead">
            Tu privacidad es importante para nosotros. Esta política describe cómo
            recopilamos, usamos y protegemos tu información personal.
          </p>

          <h2>1. Responsable del Tratamiento</h2>
          <p>
            El responsable del tratamiento de los datos personales es el Estudio
            Jurídico, con domicilio en Alta Gracia, Córdoba, Argentina.
          </p>

          <h2>2. Datos que Recopilamos</h2>
          <p>A través de nuestros formularios podemos recopilar:</p>
          <ul>
            <li>Nombre y apellido</li>
            <li>Dirección de correo electrónico</li>
            <li>Número de teléfono</li>
            <li>Localidad</li>
            <li>Descripción de la consulta o situación</li>
          </ul>

          <h2>3. Finalidad del Tratamiento</h2>
          <p>Los datos personales se utilizan para:</p>
          <ul>
            <li>Responder a las consultas recibidas</li>
            <li>Coordinar turnos y entrevistas</li>
            <li>Evaluar la posibilidad de brindar asistencia legal</li>
            <li>Mantener comunicación sobre el estado de las consultas</li>
          </ul>

          <h2>4. Base Legal</h2>
          <p>
            El tratamiento de datos se realiza en base al consentimiento expreso
            otorgado por el usuario al enviar el formulario de consulta, conforme a
            la Ley 25.326 de Protección de los Datos Personales de la República
            Argentina.
          </p>

          <h2>5. Conservación de Datos</h2>
          <p>
            Los datos personales se conservarán mientras sean necesarios para la
            finalidad para la que fueron recopilados y durante los plazos legales
            aplicables.
          </p>

          <h2>6. Derechos del Titular</h2>
          <p>
            Conforme a la Ley 25.326, tenés derecho a:
          </p>
          <ul>
            <li>Acceder a tus datos personales</li>
            <li>Solicitar la rectificación de datos inexactos</li>
            <li>Solicitar la supresión de tus datos</li>
            <li>Oponerte al tratamiento de tus datos</li>
          </ul>
          <p>
            Para ejercer estos derechos, podés contactarnos a través del email de
            contacto del estudio.
          </p>

          <h2>7. Seguridad</h2>
          <p>
            Implementamos medidas técnicas y organizativas para proteger tus datos
            personales contra acceso no autorizado, pérdida o destrucción.
          </p>

          <h2>8. Confidencialidad Profesional</h2>
          <p>
            Además de la protección de datos personales, toda información
            compartida con el estudio está protegida por el secreto profesional
            que rige la actividad de los abogados.
          </p>

          <h2>9. Modificaciones</h2>
          <p>
            Esta política puede ser actualizada periódicamente. Te recomendamos
            revisarla regularmente.
          </p>

          <h2>10. Contacto</h2>
          <p>
            Para consultas sobre esta política o sobre el tratamiento de tus datos,
            podés contactarnos a través del email del estudio.
          </p>

          <p className="text-sm text-muted-foreground mt-8">
            Última actualización: Enero 2025
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}

<script lang="ts">
    interface Props {
        onSubmit : ( answers: boolean[] ) => void;
    }

    let { onSubmit }: Props = $props();


    const QUESTIONS = [
        'Estudia el Ven, Sígueme con regularidad en la semana.',
        'Encuentra enseñanza que pueda aplicar en su vida.',
        'Comparte con otro miembro de su familia la enseñanza.',
        'Lo que Ud. ha aprendido y ha sentido, lo comparte en la clase dominical o tiene la posibilidad de hacerlo.',
    ];

    const today = new Date();

    const MONTH_NAMES = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const dateLabel = `${MONTH_NAMES[ today.getMonth() ].charAt(0).toUpperCase() + MONTH_NAMES[ today.getMonth() ].slice(1)} ${today.getFullYear()}`;


    // null = sin responder, true = Sí, false = No
    let answers = $state<( boolean | null )[]>( QUESTIONS.map( () => null ) );

    const allAnswered = $derived( answers.every( ( a ) => a !== null ) );


    function setAnswer( index: number, value: boolean ): void {
        answers[ index ] = value;
    }


    function handleSubmit(): void {
        if ( !allAnswered ) return;

        onSubmit( answers as boolean[] );
    }
</script>


<div class="survey-wrapper">
    <!-- ── Encabezado ───────────────────────────────────────────── -->
    <div class="survey-header">
        <div>
            <p class="survey-title">Encuesta Ven, Sígueme</p>
            <div class="survey-title-underline"></div>
        </div>

        <p class="survey-date">{ dateLabel }</p>
    </div>

    <!-- ── Preguntas ────────────────────────────────────────────── -->
    <ol class="survey-questions">
        {#each QUESTIONS as question, i}
            {@const answered = answers[ i ] }

            <li class="survey-question" class:answered={ answered !== null }>
                <!-- Número + texto -->
                <p class="question-text">
                    <span class="question-number">{ i + 1 }.- </span>{ question }
                </p>

                <!-- Botones Sí / No -->
                <div class="answer-row">
                    <button
                        type="button"
                        id="q{i}-yes"
                        class="answer-btn"
                        class:selected-yes={ answered === true }
                        onclick={ () => setAnswer( i, true ) }
                    >
                        <span class="answer-label">SI</span>
                        <span class="answer-box" class:filled={ answered === true }></span>
                    </button>

                    <button
                        type="button"
                        id="q{i}-no"
                        class="answer-btn"
                        class:selected-no={ answered === false }
                        onclick={ () => setAnswer( i, false ) }
                    >
                        <span class="answer-label">NO</span>
                        <span class="answer-box" class:filled={ answered === false }></span>
                    </button>
                </div>
            </li>
        {/each}
    </ol>

    <!-- ── Progreso ─────────────────────────────────────────────── -->
    <div class="progress-bar-track">
        <div
            class="progress-bar-fill"
            style="width: { ( answers.filter( ( a ) => a !== null ).length / QUESTIONS.length ) * 100 }%"
        ></div>
    </div>

    <p class="progress-label">
        { answers.filter( ( a ) => a !== null ).length } de { QUESTIONS.length } respondidas
    </p>

    <!-- ── Botón enviar ──────────────────────────────────────────── -->
    <button
        type="button"
        id="survey-submit"
        class="submit-btn"
        disabled={ !allAnswered }
        onclick={ handleSubmit }
    >
        {#if allAnswered}
            Enviar encuesta ✓
        {:else}
            Responde todas las preguntas
        {/if}
    </button>
</div>


<style>
    .survey-wrapper {
        display        : flex;
        flex-direction : column;
        gap            : 1.25rem;
    }

    /* ── Encabezado ── */
    .survey-header {
        display         : flex;
        justify-content : space-between;
        align-items     : flex-start;
        padding-bottom  : 0.75rem;
        border-bottom   : 1px solid color-mix( in srgb, currentColor 15%, transparent );
    }

    .survey-title {
        font-size   : 0.95rem;
        font-weight : 700;
        color       : var( --color-lds-navy );
        letter-spacing : 0.01em;
    }

    :global( .dark ) .survey-title {
        color : var( --color-lds-gold );
    }

    .survey-title-underline {
        margin-top       : 2px;
        height           : 2px;
        background-color : var( --color-lds-navy );
        border-radius    : 9999px;
        width            : 100%;
    }

    :global( .dark ) .survey-title-underline {
        background-color : var( --color-lds-gold );
    }

    .survey-date {
        font-size      : 0.8rem;
        font-weight    : 500;
        color          : #6b7280;
        white-space    : nowrap;
        padding-left   : 1rem;
    }

    :global( .dark ) .survey-date {
        color : #9ca3af;
    }

    /* ── Preguntas ── */
    .survey-questions {
        display        : flex;
        flex-direction : column;
        gap            : 1rem;
        padding        : 0;
        margin         : 0;
        list-style     : none;
    }

    .survey-question {
        display           : flex;
        flex-direction    : column;
        gap               : 0.5rem;
        padding           : 0.75rem 1rem;
        border-radius     : 0.75rem;
        border            : 1.5px solid #e5e7eb;
        background-color  : #f9fafb;
        transition        : border-color 200ms ease, background-color 200ms ease;
    }

    :global( .dark ) .survey-question {
        border-color     : #374151;
        background-color : #1f2937;
    }

    .survey-question.answered {
        border-color     : color-mix( in srgb, var( --color-lds-navy ) 40%, transparent );
        background-color : color-mix( in srgb, var( --color-lds-navy ) 5%, transparent );
    }

    :global( .dark ) .survey-question.answered {
        border-color     : color-mix( in srgb, var( --color-lds-gold ) 40%, transparent );
        background-color : color-mix( in srgb, var( --color-lds-gold ) 8%, transparent );
    }

    .question-text {
        font-size   : 0.82rem;
        line-height : 1.5;
        color       : #374151;
        margin      : 0;
    }

    :global( .dark ) .question-text {
        color : #d1d5db;
    }

    .question-number {
        font-weight : 700;
    }

    /* ── Botones Sí/No ── */
    .answer-row {
        display     : flex;
        gap         : 0.75rem;
        padding-top : 0.25rem;
    }

    .answer-btn {
        display         : flex;
        align-items     : center;
        gap             : 0.4rem;
        background      : none;
        border          : none;
        cursor          : pointer;
        padding         : 0.25rem 0.5rem;
        border-radius   : 0.375rem;
        transition      : background-color 150ms ease;
    }

    .answer-btn:hover {
        background-color : color-mix( in srgb, currentColor 8%, transparent );
    }

    .answer-label {
        font-size   : 0.78rem;
        font-weight : 700;
        color       : #6b7280;
        letter-spacing : 0.05em;
    }

    :global( .dark ) .answer-label {
        color : #9ca3af;
    }

    .selected-yes .answer-label,
    .selected-no  .answer-label {
        color : var( --color-lds-navy );
    }

    :global( .dark ) .selected-yes .answer-label,
    :global( .dark ) .selected-no  .answer-label {
        color : var( --color-lds-gold );
    }

    .answer-box {
        display       : inline-block;
        width         : 1.25rem;
        height        : 0.75rem;
        border        : 1.5px solid #9ca3af;
        border-radius : 3px;
        transition    : background-color 150ms ease, border-color 150ms ease;
    }

    .answer-box.filled {
        background-color : var( --color-lds-navy );
        border-color     : var( --color-lds-navy );
    }

    :global( .dark ) .answer-box.filled {
        background-color : var( --color-lds-gold );
        border-color     : var( --color-lds-gold );
    }

    /* ── Progreso ── */
    .progress-bar-track {
        height           : 4px;
        background-color : #e5e7eb;
        border-radius    : 9999px;
        overflow         : hidden;
    }

    :global( .dark ) .progress-bar-track {
        background-color : #374151;
    }

    .progress-bar-fill {
        height           : 100%;
        background-color : var( --color-lds-navy );
        border-radius    : 9999px;
        transition       : width 300ms ease;
    }

    :global( .dark ) .progress-bar-fill {
        background-color : var( --color-lds-gold );
    }

    .progress-label {
        font-size   : 0.72rem;
        color       : #9ca3af;
        text-align  : center;
        margin      : -0.5rem 0 0;
    }

    /* ── Submit ── */
    .submit-btn {
        width            : 100%;
        padding          : 0.875rem;
        border-radius    : 0.75rem;
        border           : none;
        font-size        : 0.875rem;
        font-weight      : 700;
        cursor           : pointer;
        transition       : opacity 200ms ease, transform 150ms ease;
        background-color : var( --color-lds-navy );
        color            : white;
    }

    :global( .dark ) .submit-btn {
        background-color : var( --color-lds-gold );
        color            : #111827;
    }

    .submit-btn:disabled {
        opacity         : 0.45;
        cursor          : not-allowed;
    }

    .submit-btn:not( :disabled ):hover {
        opacity   : 0.9;
        transform : scale( 1.01 );
    }

    .submit-btn:not( :disabled ):active {
        transform : scale( 0.98 );
    }
</style>

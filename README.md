# PWA Projektet

Roskilde Tekniske Skole, Webudvikler Hovedforløb WUHF02\
_Aflevering dato: 04-09-2020, kl. 13.30_

## App Koncept

Et produktivitet app baseret på konceptet af **Pomodoro Timer**.

### Funktionalitet:

- To fase: Arbejde tid (default 25 min.) og pause tid (default 5 min.)
- Fasetiden kan tilpasses.
- Man starter på arbejde tid.
- Når timer er færdig få man notification, lyd, og vibration.
- Efter en fase tid er færdig, man 'confirmere' det og så starter næste fase.
- Der er 4 knap i alt:
  - Når timer ER IKKE aktiv:
    - **Start** ville begynde med nuværende fase
    - **Skip** ville gå direkte til næste fase
  - Nar timer ER aktiv:
    - **Pause** ville pause timer på aktuelle tidspunkt
    - **Stop** ville ryd timer og nulstil til begyndelse af arbejde tid

### Teknologi

Jeg har valgt at bygge appen med [React](http://reactjs.org/) og [Parcel](https://parceljs.org/), da jeg allerede har et template for hvordan et projekt med de to tools kan bygges. Så kan jeg fokusere helt på at bygge funktionaliteten.

Jeg har også valgt at brug [Moment.js](https://momentjs.com/) for de tidsstempler.

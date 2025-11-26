# Hup Holland - Startup Funding Platform

Een LinkedIn-achtige website waar startups en scaleups informatie kunnen krijgen over funding mogelijkheden, met een intelligente AI-powered recommender systeem.

## Features

- **Funding Directory**: Browse alle beschikbare funding opportunities
- **Startup Directory**: Discover andere startups in het netwerk
- **AI Recommendation Engine**: Machine learning-gebaseerde matching algoritme dat funding opportunities adviseert op basis van jouw profiel
- **User Dashboard**: Overzicht van profiel completion, opgeslagen opportunities en applicaties
- **Responsive Design**: Volledig responsive ontwerp gemaakt met Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **AI Algorithm**: Cosine Similarity-based Recommender System

## Getting Started

### Prerequisites

- Node.js 18+ en npm

### Installation

1. Clone dit project
2. Navigeer naar de project directory
3. Install dependencies:

```bash
npm install
```

### Development

Start de development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

### Build

Build voor production:

```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── funding/          # Funding opportunities API
│   │   └── recommendations/  # AI recommendation engine API
│   ├── dashboard/            # User dashboard pagina
│   ├── funding/              # Funding opportunities pagina
│   ├── recommendations/      # Recommendation form pagina
│   ├── startups/             # Startups directory pagina
│   ├── signup/               # Signup pagina
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
```

## AI Recommendation System

### Hoe het werkt

Het recommender systeem gebruikt **Cosine Similarity** om startup profielen te matchen met funding opportunities. Dit algoritme:

1. **Vectoriseert Input**: Zet alle numerische en categorische features om naar normaliseerde vectoren
2. **Berekent Overeenkomsten**: Berekent cosine similarity tussen user-profiel en elke startup in de database
3. **Rankt Resultaten**: Sorteert opportunities op basis van match score (0-100%)
4. **Bepaalt Funding Type**: Classificeert aanbevolen funding type op basis van funding rounds en amount

### Features gebruikt voor matching

- **Numerieke Features** (genormaliseerd 0-1):
  - Revenue (jaarlijks, M USD)
  - Employees (aantal medewerkers)
  - Valuation (M USD)
  - Desired Funding Amount (M USD)
  - Market Share (%)
  - Year Founded (genormaliseerd)

- **Categorische Features**:
  - Industry (AI, FinTech, EdTech, IoT, Clean Energy, HealthTech, E-commerce)
  - Region (Europe, North America, Asia, South America)
  - Profitability Status (ja/nee)

### Funding Type Classification

Het systeem classificeert automatisch welk type funding het best aansluit:

```
Seed Funding / Pre-seed    : ≤1 funding rounds, <€200M
Series A                   : ≤2 funding rounds
Series B                   : 3 funding rounds
Series C                   : 4 funding rounds
Growth Funding / Late Stage: ≥5 funding rounds
```

### API Endpoint

**POST** `/api/recommendations`

**Request Body**:
```json
{
  "industry": "AI",
  "region": "Europe",
  "revenue": 5,
  "employees": 50,
  "marketShare": 8,
  "valuation": 1000,
  "fundingAmount": 250,
  "profitable": true,
  "yearFounded": 2022
}
```

**Response**:
```json
{
  "success": true,
  "recommendations": [
    {
      "startupName": "TechAI Startup",
      "recommendedFundingType": "Series A",
      "matchScore": 87.5,
      "industry": "AI",
      "region": "Europe"
    }
  ],
  "totalMatches": 1
}
```

## Pages & Routes

| Route | Beschrijving |
|-------|--------------|
| `/` | Homepage met hero section en AI features uitleg |
| `/funding` | Browse funding opportunities |
| `/recommendations` | Interactieve AI recommendation form |
| `/dashboard` | Persoonlijke dashboard |
| `/startups` | Startups directory |
| `/signup` | Account creatie |

## Mock Dataset

Het systeem bevat momenteel 6 mock startups voor testing:

1. **TechAI Startup** - AI, Europe, Series A
2. **FinTech Solutions** - FinTech, Europe, Series B
3. **EdTech Platform** - EdTech, North America, Series C
4. **IoT Innovations** - IoT, Asia, Series A
5. **Green Energy Corp** - Clean Energy, Europe, Seed
6. **Health Tech Inc** - HealthTech, North America, Series A

## Toekomstige Uitbreidingen

- [ ] User authentication & profiles
- [ ] Database integratie (MongoDB/PostgreSQL)
- [ ] Advanced filtering & search
- [ ] Investor directory
- [ ] Message systeem tussen startups en investoren
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Payment integration voor premium features
- [ ] Real startup data integration
- [ ] Improved ML models met meer features

## Voordelen van het AI-systeem

✅ **Personalisatie**: Elk startup krijgt aangepaste aanbevelingen
✅ **Efficiëntie**: Snel funding opportunities vinden die passen
✅ **Transparantie**: Match scores laten zien hoe goed het aansluit
✅ **Schaalbaar**: Werkt met grote datasets van opportunities
✅ **Real-time**: Instant recommendations zonder page reload

## License

MIT

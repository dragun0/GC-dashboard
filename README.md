# Forecast Model Performance Dashboard

**Mapping Weather Forecast Performances - AI vs Physics**

This repository contains the code and documentation for the web-based dashboard developed as part of the master thesis project titled:

**Machine Learning vs. Physics-Based Weather Models: A Geospatial Assessment of AI’s Potential for More Accurate Weather Forecasting - Developing an Interactive Model Evaluation Dashboard for Performance Testing**  
_Politecnico di Milano – MSc Geoinformatics Engineering_  
Author: Leonie Dragun (10776334)  
Advisor: Prof. Giovanna Venuti
Co-advisor: Francesco Asaro

## Live Application

Access the live dashboard here: [https://gc-dashboard-red.vercel.app/](https://gc-dashboard-red.vercel.app/)

## Overview

This dashboard visualises and compares the forecast performance of three global weather models:

- **ECMWF IFS-HRES** (Numerical Weather Prediction)
- **Google DeepMind’s GraphCast** (Machine Learning)
- **ECMWF AIFS** (Machine Learning)

The goal is to support transparent and interactive geospatial performance assessment across regions, variables, lead times, and seasons, using standard verification metrics (e.g., RMSE, MAE, MBE, R).

It addresses key limitations of existing evaluation platforms such as WeatherBench 2 by:

- Incorporating **AIFS**, which is not yet available in WeatherBench 2
- Allowing interactive **map-based exploration** of spatially explicit forecast errors
- Supporting **monthly temporal resolution** and **custom region statistics**

## Scientific Context

Forecast models are benchmarked against the **ERA5 reanalysis** dataset across five key near-surface variables:

- 2m air temperature (T2M)
- Specific humidity at 1000 hPa (Q)
- Mean sea level pressure (MSLP)
- Zonal wind speed at 10m (U10)
- Meridional wind speed at 10m (V10)

Performance metrics include:

- **Root Mean Square Error (RMSE)**
- **Mean Absolute Error (MAE)**
- **Mean Bias Error (MBE)**
- **Pearson Correlation Coefficient (R)**

For detailed methodology and evaluation results, refer to Section 4 and 6 of the [thesis document](link-to-thesis).

## Features

- Global and regional interactive maps (Zarr pyramids)
- Time series, monthly plots, and variable-wise comparison
- Custom region statistics (draw & inspect)
- Supports exploration by variable, model, metric, month, and lead time
- Optimised for performance using **cloud-optimised Zarr** and **Next.js + React** frontend

## Repository Structure

```
/public                → Static assets & JSON plot data
/pages                 → Dashboard pages (Map & Analysis)
/components            → Reusable UI components (Charts, Inspectors, Maps)

```

## Technologies Used

- **Frontend:** Next.js, React, Recharts, @carbonplan/maps, @carbonplan/minimaps
- **Data Format:** Zarr, JSON
- **Processing:** Python (xarray, rioxarray, pandas, ndpyramid)
- **Deployment:** Vercel
- **Storage:** AWS S3 (for Zarr files)

## Getting Started

### Prerequisites

- Node.js (v16+)

### Installation

1. Clone the repository

```bash
git clone https://github.com/dragun0/GC-dashboard.git
cd GC-dashboard
```

2. Install dependencies

```bash
npm install
```

3. Run the development server

```bash
npm run dev
```

4. Navigate to [http://localhost:3000](http://localhost:3000)

## Data Access

- Forecast data preprocessed and stored as Zarr files in AWS S3.
- Plot metadata stored as static JSON files and bundled into the app.
- Jupyter Notebooks for preprocessing, metric computation, and Zarr pyramid creation are available in this separate repository: [Dashboard-DataProduction](https://github.com/dragun0/Dashboard-DataProduction/tree/main)

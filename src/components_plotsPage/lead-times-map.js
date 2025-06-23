import { Box, useThemeUI, Spinner, Divider } from 'theme-ui'
import TooltipWrapper from '../components/tooltip-wrapper'
import { Row, Column, Filter } from '@carbonplan/components'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Minimap, Raster, Path, Sphere, Graticule } from '@carbonplan/minimaps'
import { naturalEarth1, mercator, orthographic, equirectangular } from '@carbonplan/minimaps/projections'
import { useThemedColormap, viridis } from '@carbonplan/colormaps'
import { usePlotsContext } from '../components_plotsPage/PlotsContext'
import MonthSlider from '../components_plotsPage/month-slider'
import LeadTimesSlider from '../components_plotsPage/lead-times-slider'
import zarr from 'zarr-js'
import ndarray from 'ndarray'
import ops from 'ndarray-ops'
import pool from 'ndarray-scratch'
import Legend from '../components_plotsPage/lead-times-legend'
import { get } from 'ol/proj'
import { set } from 'ol/transform'
import { color } from '@carbon/charts'

// plate carree projection zarr works: 
// has float32 data and is in equirectangular projection BUT y axis NEEDS TO BE FLIPPED (is going from + to - instead of - to +)


//const ZARR_SOURCE = 'https://dashboard-minimaps.s3.amazonaws.com/minimap_test_zlib_flipped_float32.zarr'

//Global Extent sources
const ZARR_SOURCE_gc_RMSE = 'https://dashboard-minimaps.s3.amazonaws.com/Global_gc_RMSE_MAP_leadtimes.zarr'
const ZARR_SOURCE_gc_MBE = 'https://dashboard-minimaps.s3.amazonaws.com/Global_gc_MBE_MAP_leadtimes.zarr'
const ZARR_SOURCE_gc_MAE = 'https://dashboard-minimaps.s3.amazonaws.com/Global_gc_MAE_MAP_leadtimes.zarr'

const ZARR_SOURCE_marsfc_RMSE = 'https://dashboard-minimaps.s3.amazonaws.com/Global_marsfc_RMSE_MAP_leadtimes.zarr'
const ZARR_SOURCE_marsfc_MBE = 'https://dashboard-minimaps.s3.amazonaws.com/Global_marsfc_MBE_MAP_leadtimes.zarr'
const ZARR_SOURCE_marsfc_MAE = 'https://dashboard-minimaps.s3.amazonaws.com/Global_marsfc_MAE_MAP_leadtimes.zarr'

const ZARR_SOURCE_marsai_RMSE = 'https://dashboard-minimaps.s3.amazonaws.com/Global_marsai_RMSE_MAP_leadtimes.zarr'
const ZARR_SOURCE_marsai_MBE = 'https://dashboard-minimaps.s3.amazonaws.com/Global_marsai_MBE_MAP_leadtimes.zarr'
const ZARR_SOURCE_marsai_MAE = 'https://dashboard-minimaps.s3.amazonaws.com/Global_marsai_MAE_MAP_leadtimes.zarr'


// Africa sources
const AFRICA_ZARR_SOURCE_gc_RMSE = 'https://dashboard-minimaps.s3.amazonaws.com/Africa_gc_RMSE_MAP_leadtimes.zarr'
const AFRICA_ZARR_SOURCE_gc_MBE = 'https://dashboard-minimaps.s3.amazonaws.com/Africa_gc_MBE_MAP_leadtimes.zarr'
const AFRICA_ZARR_SOURCE_gc_MAE = 'https://dashboard-minimaps.s3.amazonaws.com/Africa_gc_MAE_MAP_leadtimes.zarr'

const AFRICA_ZARR_SOURCE_marsfc_RMSE = 'https://dashboard-minimaps.s3.amazonaws.com/Africa_marsfc_RMSE_MAP_leadtimes.zarr'
const AFRICA_ZARR_SOURCE_marsfc_MBE = 'https://dashboard-minimaps.s3.amazonaws.com/Africa_marsfc_MBE_MAP_leadtimes.zarr'
const AFRICA_ZARR_SOURCE_marsfc_MAE = 'https://dashboard-minimaps.s3.amazonaws.com/Africa_marsfc_MAE_MAP_leadtimes.zarr'

const AFRICA_ZARR_SOURCE_marsai_RMSE = 'https://dashboard-minimaps.s3.amazonaws.com/Africa_marsai_RMSE_MAP_leadtimes.zarr'
const AFRICA_ZARR_SOURCE_marsai_MBE = 'https://dashboard-minimaps.s3.amazonaws.com/Africa_marsai_MBE_MAP_leadtimes.zarr'
const AFRICA_ZARR_SOURCE_marsai_MAE = 'https://dashboard-minimaps.s3.amazonaws.com/Africa_marsai_MAE_MAP_leadtimes.zarr'




//const VARIABLE = 't2m'
const FILL_VALUE = 9.969209968386869e36




const sx = {
    label: {
        color: 'secondary',
        fontFamily: 'mono',
        letterSpacing: 'mono',
        fontSize: [1, 1, 1, 2],
        textTransform: 'uppercase',
        mt: ['3px', '3px', '3px', '1px'],
    },
    heading: {
        fontFamily: 'heading',
        fontWeight: 'bold',
        letterSpacing: 'smallcaps',
        // textTransform: 'uppercase',
        fontSize: [3, 3, 3, 3],
        mb: [2],
    },
    subheading: {
        fontFamily: 'mono',
        letterSpacing: 'mono',
        color: 'secondary',
        fontSize: [1],
        textTransform: 'uppercase',
    },

    legend: {
        color: 'primary ',
        fontFamily: 'mono',
        letterSpacing: 'mono',
        fontSize: [1, 1, 1, 2],
        textTransform: 'uppercase',
        mt: ['3px', '3px', '3px', '1px'],
    },
}

const CLIM_RANGES = {
    RMSE: {
        t2m: { min: 0, max: 10 },
        q: { min: 0, max: 3 },
        msl: { min: 0, max: 14 },
        u10: { min: 0, max: 8 },
        v10: { min: 0, max: 8 },
    },
    MAE: {
        t2m: { min: 0, max: 10 },
        q: { min: 0, max: 3 },
        msl: { min: 0, max: 14 },
        u10: { min: 0, max: 8 },
        v10: { min: 0, max: 8 },
    },
    MBE: {
        t2m: { min: -2, max: 2 },
        q: { min: -1, max: 1 },
        msl: { min: -2, max: 2 },
        u10: { min: -2, max: 2 },
        v10: { min: -2, max: 2 },
    },
}

const COLORMAPS = {
    RMSE: {
        t2m: { name: 'warm', reverse: false },
        q: { name: 'cool', reverse: false },
        msl: { name: 'earth', reverse: false },
        u10: { name: 'water', reverse: false },
        v10: { name: 'water', reverse: false },
    },
    MAE: {
        t2m: { name: 'warm', reverse: false },
        q: { name: 'cool', reverse: false },
        msl: { name: 'earth', reverse: false },
        u10: { name: 'water', reverse: false },
        v10: { name: 'water', reverse: false },
    },
    MBE: {
        t2m: { name: 'redteal', reverse: true },      // reversed!
        q: { name: 'orangeblue', reverse: true },
        msl: { name: 'pinkgreen', reverse: true },
        u10: { name: 'bluegrey', reverse: true },
        v10: { name: 'bluegrey', reverse: true },
    },
}


const LeadTimesMap = (props) => {

    const {
        //   LAT_MIN,
        //  LAT_MAX,
        region
    } = props

    //Get shared context state
    const {
        Column1Region, setColumn1Region,

    } = usePlotsContext()

    let LAT_MIN = '';
    if (region === 'global' || region === 'africa') LAT_MIN = -90;
    else if (region === 'tropics') LAT_MIN = -23.5;
    else if (region === 'temperate') LAT_MIN = -60;
    else if (region === 'polar') LAT_MIN = -90;


    let LAT_MAX = '';
    if (region === 'global' || region === 'africa') LAT_MAX = 90;
    else if (region === 'tropics') LAT_MAX = 23.5;
    else if (region === 'temperate') LAT_MAX = 60;
    else if (region === 'polar') LAT_MAX = 90;


    // const africaGeoJSON = await fetch('/geo/africa.geojson').then(res => res.json());

    const { theme } = useThemeUI()
    // const colormap = useThemedColormap('warm')
    const [loading, setLoading] = useState(false)
    const [time, setTime] = useState(4)
    const [chunks, setChunks] = useState(null)
    const [clim, setClim] = useState([0, 10]) // default clim for the colormap
    const [colormapName, setColormapName] = useState('warm') // default colormap
    const [colormapReverse, setColormapReverse] = useState(false)

    const colormap = useThemedColormap(colormapName)
    const finalColormap = colormapReverse ? [...colormap].reverse() : colormap


    // for UI buttons only
    const [models, setModel] = useState({ GraphCast: true, ECMWFIFS: false, ECMWFAIFS: false })
    const [variables, setVariables] = useState({ t2m: false, msl: false, u10: false, v10: false, q: true })
    const [metrics, setMetrics] = useState({ RMSE: true, MAE: false, MBE: false })
    const [extent, setExtent] = useState({ tropics: true, subtropics: false })

    const [TemperateExtent, setTemperateExtent] = useState({ northtemperate: true, southtemperate: false })

    // for the UI button of the region filter only
    //const [regions, setRegion] = useState({ global: true, tropics: false, temperate: false, polar: false, africa: false })


    // to keep track of the actually selected variable, model, metric
    const [selectedVariable, setSelectedVariable] = useState('q');
    const [selectedModel, setSelectedModel] = useState('GraphCast')
    const [selectedMetric, setSelectedMetric] = useState('RMSE')

    const variableCache = useRef({}) // cache for loaded variables

    // keep track of the actual extent selected (for the tropics section)
    const [selectedExtent, setSelectedExtent] = useState(['tropics']);

    // keep track of the actual temperate extent selected (for the temperate zones section)
    const [selectedTemperateExtent, setSelectedTemperateExtent] = useState(['northtemperate']);

    // make sure one button of the tropic extents is always selected
    const handleSetExtent = (newExtent) => {
        const activeKeys = Object.keys(newExtent).filter(key => newExtent[key]);
        if (activeKeys.length === 0) return; // prevent none selected

        setExtent(newExtent);
        setSelectedExtent(activeKeys);
    };

    // handle temperate extent change (north or south)
    // make sure one button is always selected
    const handleSetTemperateExtent = (newTemperateExtent) => {
        const activeKeys = Object.keys(newTemperateExtent).filter(key => newTemperateExtent[key]);
        if (activeKeys.length === 0) return; // prevent none selected

        setTemperateExtent(newTemperateExtent);
        setSelectedTemperateExtent(activeKeys);
    };

    // for debugging only
    useEffect(() => {
        console.log('Selected extent changed:', selectedExtent)
    }, [selectedExtent])


    // handle variable change
    const handleVariableChange = useCallback((e) => {
        //  console.log('handleVariableChange', e.target.value)
        const selected = e.target.value
        setSelectedVariable(selected)
        //  setClim([CLIM_RANGES[selected].min, CLIM_RANGES[selected].max])
    }, [setSelectedVariable])
    // change clim values depending on variable

    const cacheKey = `${region}_${selectedModel}_${selectedMetric}_${selectedVariable}`

    // choose ZARR_SOURCE based on model

    let ZARR_SOURCE = ''

    if (region == 'africa') {
        if (selectedModel === 'GraphCast' && selectedMetric === 'RMSE') ZARR_SOURCE = AFRICA_ZARR_SOURCE_gc_RMSE
        else if (selectedModel === 'ECMWFIFS' && selectedMetric === 'RMSE') ZARR_SOURCE = AFRICA_ZARR_SOURCE_marsfc_RMSE
        else if (selectedModel === 'ECMWFAIFS' && selectedMetric === 'RMSE') ZARR_SOURCE = AFRICA_ZARR_SOURCE_marsai_RMSE
        else if (selectedModel === 'GraphCast' && selectedMetric === 'MBE') ZARR_SOURCE = AFRICA_ZARR_SOURCE_gc_MBE
        else if (selectedModel === 'ECMWFIFS' && selectedMetric === 'MBE') ZARR_SOURCE = AFRICA_ZARR_SOURCE_marsfc_MBE
        else if (selectedModel === 'ECMWFAIFS' && selectedMetric === 'MBE') ZARR_SOURCE = AFRICA_ZARR_SOURCE_marsai_MBE
        else if (selectedModel === 'GraphCast' && selectedMetric === 'MAE') ZARR_SOURCE = AFRICA_ZARR_SOURCE_gc_MAE
        else if (selectedModel === 'ECMWFIFS' && selectedMetric === 'MAE') ZARR_SOURCE = AFRICA_ZARR_SOURCE_marsfc_MAE
        else if (selectedModel === 'ECMWFAIFS' && selectedMetric === 'MAE') ZARR_SOURCE = AFRICA_ZARR_SOURCE_marsai_MAE

    } else {
        if (selectedModel === 'GraphCast' && selectedMetric === 'RMSE') ZARR_SOURCE = ZARR_SOURCE_gc_RMSE
        else if (selectedModel === 'ECMWFIFS' && selectedMetric === 'RMSE') ZARR_SOURCE = ZARR_SOURCE_marsfc_RMSE
        else if (selectedModel === 'ECMWFAIFS' && selectedMetric === 'RMSE') ZARR_SOURCE = ZARR_SOURCE_marsai_RMSE
        else if (selectedModel === 'GraphCast' && selectedMetric === 'MBE') ZARR_SOURCE = ZARR_SOURCE_gc_MBE
        else if (selectedModel === 'ECMWFIFS' && selectedMetric === 'MBE') ZARR_SOURCE = ZARR_SOURCE_marsfc_MBE
        else if (selectedModel === 'ECMWFAIFS' && selectedMetric === 'MBE') ZARR_SOURCE = ZARR_SOURCE_marsai_MBE
        else if (selectedModel === 'GraphCast' && selectedMetric === 'MAE') ZARR_SOURCE = ZARR_SOURCE_gc_MAE
        else if (selectedModel === 'ECMWFIFS' && selectedMetric === 'MAE') ZARR_SOURCE = ZARR_SOURCE_marsfc_MAE
        else if (selectedModel === 'ECMWFAIFS' && selectedMetric === 'MAE') ZARR_SOURCE = ZARR_SOURCE_marsai_MAE
    }


    //const [ZARR_SOURCE, setZarrSource] = useState('')



    // Define the latitude range for the tropics/subtropics
    // const LAT_MIN = -35
    // const LAT_MAX = 35

    // State to hold the latitude values
    const [latitudes, setLatitudes] = useState(null)

    // Generate whole latitude array manually in JS on first render
    // could not access /y from Zarr, so generating it since compressor used for coordinates was blosc instead of zlib (blosc is not supported by zarr-js)
    // needed to cut the dataset to the tropics+subtropics and temperate regions
    useEffect(() => {
        if (!latitudes) {
            const nLat = 721 // 
            const Latitudes = Array.from({ length: nLat }, (_, i) => -90 + i * (180 / (nLat - 1)))
            setLatitudes(Latitudes)
        }
        //  console.log('Latitudes generated:', latitudes)
    })





    // Load latitude values from Zarr on first load
    /*
    useEffect(() => {
        // Only load once
        if (!latitudes && ZARR_SOURCE) {
            zarr().load(`${ZARR_SOURCE}/y`, (err, arr) => {
                if (err) {
                    console.error('Error loading latitude array:', err)
                    return
                }
                // Convert to plain JS array
                setLatitudes(Array.from(arr.data))
            })
        }
    }, [ZARR_SOURCE, latitudes])

    */


    useEffect(() => {

        console.log('useEffect - Selected variable changed:', selectedVariable)
        console.log('cacheKey:', cacheKey)

        // Load the selected variable only if not cached
        if (!variableCache.current[cacheKey]) {
            setLoading(true) // <--- Set loading to true 
            //  console.log('useEffect - load new data:', selectedVariable)
            //  console.log('URL:', `${ZARR_SOURCE}/${selectedVariable}`)
            zarr().load(`${ZARR_SOURCE}/${selectedVariable}`, (err, arr) => {
                if (err) {
                    setLoading(false)
                    //  console.error('Error loading array:', err)
                    // add error message to the map as well
                    return
                }
                variableCache.current[cacheKey] = arr
                setChunks(arr)
                setLoading(false)
                const climRange = CLIM_RANGES[selectedMetric]?.[selectedVariable] || { min: 0, max: 1 }
                setClim([climRange.min, climRange.max]) // set clim based on variable and metric
                const colormapConfig = COLORMAPS[selectedMetric]?.[selectedVariable] || { name: 'warm', reverse: false }
                setColormapName(colormapConfig.name)
                setColormapReverse(colormapConfig.reverse)
                //    console.log('useEffect chunk updated with variable:', selectedVariable, 'with data:', arr)
            })
        } else {
            //  console.log('useEffect - var:', selectedVariable, 'already cached, using cached data')
            setChunks(variableCache.current[cacheKey])
            setLoading(false)
            const climRange = CLIM_RANGES[selectedMetric]?.[selectedVariable] || { min: 0, max: 1 }
            setClim([climRange.min, climRange.max])
            const colormapConfig = COLORMAPS[selectedMetric]?.[selectedVariable] || { name: 'warm', reverse: false }
            setColormapName(colormapConfig.name)
            setColormapReverse(colormapConfig.reverse)
        }
    }, [selectedModel, selectedMetric, selectedVariable, region])



    const data = useMemo(() => {
        if (chunks && latitudes) {


            // polar+subpolar zones: 60 to 90 and -60 to -90
            if (region == 'polar') {
                // for temperate case: Find indices for the -60 to 60 latitude window 
                // for polar case: find indeces for the -90 to 90 latitude window
                const latStartAll = latitudes.findIndex(lat => lat >= LAT_MIN)
                let latEndAll = latitudes.findIndex(lat => lat > LAT_MAX)
                if (latEndAll === -1) latEndAll = latitudes.length
                const nLatSubset = latEndAll - latStartAll
                const nLon = chunks.shape[2]

                // Indices for north and south temperate (polar) bands within the subset
                const northStart = latitudes.findIndex(lat => lat >= 60)
                let northEnd = latitudes.findIndex(lat => lat > LAT_MAX)
                if (northEnd === -1) northEnd = latitudes.length

                const southStart = latitudes.findIndex(lat => lat >= LAT_MIN)
                let southEnd = latitudes.findIndex(lat => lat > -60)
                if (southEnd === -1) southEnd = latitudes.length

                // Adjust indices to be relative to the subset
                const northStartSub = northStart - latStartAll
                const northEndSub = northEnd - latStartAll
                const southStartSub = southStart - latStartAll
                const southEndSub = southEnd - latStartAll

                const picked = chunks.pick(time, null, null)

                // Bands (relative to full picked)
                const northBand = picked.lo(northStart, 0).hi(northEnd - northStart, nLon)
                const southBand = picked.lo(southStart, 0).hi(southEnd - southStart, nLon)

                // Create a subset array filled with FILL_VALUE
                // needed to fill the space between north and south temperate zone with fill values
                const subset = ndarray(
                    new picked.data.constructor(nLatSubset * nLon),
                    [nLatSubset, nLon]
                )
                ops.assigns(subset, FILL_VALUE)

                // Copy northBand into subset
                for (let i = 0; i < northBand.shape[0]; ++i)
                    for (let j = 0; j < nLon; ++j)
                        subset.set(i + northStartSub, j, northBand.get(i, j))
                // Copy southBand into subset
                for (let i = 0; i < southBand.shape[0]; ++i)
                    for (let j = 0; j < nLon; ++j)
                        subset.set(i + southStartSub, j, southBand.get(i, j))

                return subset


            } if (region === 'tropics') {
                const bothSelected = selectedExtent.includes('tropics') && selectedExtent.includes('subtropics');
                const subtropicsOnly = selectedExtent.length === 1 && selectedExtent[0] === 'subtropics';

                // If both selected → show full -35 to 35 band
                if (bothSelected) {
                    const latStart = latitudes.findIndex(lat => lat >= -35);
                    let latEnd = latitudes.findIndex(lat => lat > 35);
                    if (latEnd === -1) latEnd = latitudes.length;

                    const picked = chunks.pick(time, null, null);
                    const cropped = picked.lo(latStart, 0).hi(latEnd - latStart, picked.shape[1]);
                    return cropped;
                }

                // If only Subtropics selected → do subtropics banding
                if (subtropicsOnly) {
                    // Find indeces for the -35 to 35 latitude window
                    const latStartAll = latitudes.findIndex(lat => lat >= -35)
                    let latEndAll = latitudes.findIndex(lat => lat > 35)
                    if (latEndAll === -1) latEndAll = latitudes.length
                    const nLatSubset = latEndAll - latStartAll
                    const nLon = chunks.shape[2]

                    // Indices for north and south subtropic bands within the subset
                    const northStart = latitudes.findIndex(lat => lat >= 23.5)
                    let northEnd = latitudes.findIndex(lat => lat > 35)
                    if (northEnd === -1) northEnd = latitudes.length

                    const southStart = latitudes.findIndex(lat => lat >= -35)
                    let southEnd = latitudes.findIndex(lat => lat > -23.5)
                    if (southEnd === -1) southEnd = latitudes.length

                    // Adjust indices to be relative to the subset
                    const northStartSub = northStart - latStartAll
                    const northEndSub = northEnd - latStartAll
                    const southStartSub = southStart - latStartAll
                    const southEndSub = southEnd - latStartAll

                    const picked = chunks.pick(time, null, null)

                    // Bands (relative to full picked)
                    const northBand = picked.lo(northStart, 0).hi(northEnd - northStart, nLon)
                    const southBand = picked.lo(southStart, 0).hi(southEnd - southStart, nLon)

                    // Create a subset array filled with FILL_VALUE
                    // needed to fill the space between north and south temperate zone with fill values
                    const subset = ndarray(
                        new picked.data.constructor(nLatSubset * nLon),
                        [nLatSubset, nLon]
                    )
                    ops.assigns(subset, FILL_VALUE)

                    // Copy northBand into subset
                    for (let i = 0; i < northBand.shape[0]; ++i)
                        for (let j = 0; j < nLon; ++j)
                            subset.set(i + northStartSub, j, northBand.get(i, j))
                    // Copy southBand into subset
                    for (let i = 0; i < southBand.shape[0]; ++i)
                        for (let j = 0; j < nLon; ++j)
                            subset.set(i + southStartSub, j, southBand.get(i, j))

                    return subset
                }
            }

            // If only Tropics selected → default lat min/max
            if (selectedExtent.length === 1 && selectedExtent[0] === 'Tropics') {
                const latStart = latitudes.findIndex(lat => lat >= LAT_MIN);
                let latEnd = latitudes.findIndex(lat => lat > LAT_MAX);
                if (latEnd === -1) latEnd = latitudes.length;

                const picked = chunks.pick(time, null, null);
                const cropped = picked.lo(latStart, 0).hi(latEnd - latStart, picked.shape[1]);
                return cropped;
            }

            // if region = temperate
            if (region === 'temperate') {
                const bothSelected = selectedTemperateExtent.includes('northtemperate') && selectedTemperateExtent.includes('southtemperate');
                const northTempOnly = selectedTemperateExtent.length === 1 && selectedTemperateExtent[0] === 'northtemperate';
                const southTempOnly = selectedTemperateExtent.length === 1 && selectedTemperateExtent[0] === 'southtemperate'; // check if this works

                // If both selected → do north and south banding

                if (bothSelected) {
                    // Find indeces for the -60 to 60 latitude window
                    const latStartAll = latitudes.findIndex(lat => lat >= -60)
                    let latEndAll = latitudes.findIndex(lat => lat > 60)
                    if (latEndAll === -1) latEndAll = latitudes.length
                    const nLatSubset = latEndAll - latStartAll
                    const nLon = chunks.shape[2]

                    // Indices for north and south temperate bands within the subset
                    const northStart = latitudes.findIndex(lat => lat >= 35)
                    let northEnd = latitudes.findIndex(lat => lat > 60)
                    if (northEnd === -1) northEnd = latitudes.length

                    const southStart = latitudes.findIndex(lat => lat >= -60)
                    let southEnd = latitudes.findIndex(lat => lat > -35)
                    if (southEnd === -1) southEnd = latitudes.length

                    // Adjust indices to be relative to the subset
                    const northStartSub = northStart - latStartAll
                    const northEndSub = northEnd - latStartAll
                    const southStartSub = southStart - latStartAll
                    const southEndSub = southEnd - latStartAll

                    const picked = chunks.pick(time, null, null)

                    // Bands (relative to full picked)
                    const northBand = picked.lo(northStart, 0).hi(northEnd - northStart, nLon)
                    const southBand = picked.lo(southStart, 0).hi(southEnd - southStart, nLon)

                    // Create a subset array filled with FILL_VALUE
                    // needed to fill the space between north and south temperate zone with fill values
                    const subset = ndarray(
                        new picked.data.constructor(nLatSubset * nLon),
                        [nLatSubset, nLon]
                    )
                    ops.assigns(subset, FILL_VALUE)

                    // Copy northBand into subset
                    for (let i = 0; i < northBand.shape[0]; ++i)
                        for (let j = 0; j < nLon; ++j)
                            subset.set(i + northStartSub, j, northBand.get(i, j))
                    // Copy southBand into subset
                    for (let i = 0; i < southBand.shape[0]; ++i)
                        for (let j = 0; j < nLon; ++j)
                            subset.set(i + southStartSub, j, southBand.get(i, j))

                    return subset
                }

                // If only north temperate selected
                if (northTempOnly) {
                    const latStart = latitudes.findIndex(lat => lat >= 35);
                    let latEnd = latitudes.findIndex(lat => lat > 60);
                    if (latEnd === -1) latEnd = latitudes.length;

                    const picked = chunks.pick(time, null, null);
                    const cropped = picked.lo(latStart, 0).hi(latEnd - latStart, picked.shape[1]);
                    return cropped;
                }

                // If only south temperate selected
                if (southTempOnly) {
                    const latStart = latitudes.findIndex(lat => lat >= -60);
                    let latEnd = latitudes.findIndex(lat => lat > -35);
                    if (latEnd === -1) latEnd = latitudes.length;

                    const picked = chunks.pick(time, null, null);
                    const cropped = picked.lo(latStart, 0).hi(latEnd - latStart, picked.shape[1]);
                    return cropped;
                }
            }

            else {
                // Default: single band
                // used for global and africa extent
                const latStart = latitudes.findIndex(lat => lat >= LAT_MIN)
                let latEnd = latitudes.findIndex(lat => lat > LAT_MAX)
                if (latEnd === -1) latEnd = latitudes.length
                const picked = chunks.pick(time, null, null)
                const cropped = picked.lo(latStart, 0).hi(latEnd - latStart, picked.shape[1])
                return cropped
            }
        } else {
            return null
        }
    }, [chunks, time, latitudes, LAT_MIN, LAT_MAX, region, selectedExtent, selectedTemperateExtent])


    /*

    const data = useMemo(() => {
        if (chunks && latitudes) {
            // Find indices for cropping
            const latStart = latitudes.findIndex(lat => lat >= LAT_MIN)
            // Find the first index greater than LAT_MAX, or use the end of the array
            let latEnd = latitudes.findIndex(lat => lat > LAT_MAX)
            if (latEnd === -1) latEnd = latitudes.length
            // Pick the time slice, then crop latitude
            const picked = chunks.pick(time, null, null)
            const cropped = picked.lo(latStart, 0).hi(latEnd - latStart, picked.shape[1])
            //    console.log('Cropped data shape:', cropped.shape)
            return cropped

        } else {
            return {}
        }
    }, [chunks, time])

    */


    /*
      const data = useMemo(() => {
          if (chunks) {
              return chunks.pick(time, null, null) // time, lat, lon
          } else {
              return null
          }
      }, [chunks, time])
  
  */


    // for debugging only
    useEffect(() => {
        console.log('Updated data:', data)


    }, [data])


    // for debugging only
    useEffect(() => {
        console.log('selected var changed:', selectedVariable)
    }, [selectedVariable])





    return (
        <>

            {/* Title Section - Lead Times Spatial Performance */}
            <Box sx={{ transform: 'scale(0.90)', transformOrigin: 'top left', width: '111.11%' }}>

                <Box sx={{
                    pt: [2],
                    pb: [2],

                }}>
                    <TooltipWrapper
                        tooltip=' Visualises the performance of the selected forecast model in different parts of the 
                    regional extent at each lead time computed over all months of the year 2024.
                    Each pixel in this map answers the question: "On average across the year, how wrong is the model at this location for this lead time?"'
                    >
                        {/* show tropics or subtropics filter if overall region is = tropics */}
                        {(() => {
                            if (region === 'tropics') {
                                return (
                                    <Row
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                            //alignItems: 'center', // optional: aligns them vertically
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                ...sx.heading,
                                                textTransform: 'uppercase',
                                                fontSize: [2],
                                                color: '#45DFB1',
                                            }}
                                        >
                                            Lead Times Spatial Performance
                                        </Box>


                                        <Filter
                                            sx={{
                                                pr: 4,
                                            }}
                                            values={extent}
                                            setValues={handleSetExtent}
                                            multiSelect={true}

                                        />

                                    </Row>
                                )
                            } else if (region === 'temperate') {
                                return (
                                    <Row
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                            //alignItems: 'center', // optional: aligns them vertically
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                ...sx.heading,
                                                textTransform: 'uppercase',
                                                fontSize: [2],
                                                color: '#45DFB1',
                                            }}
                                        >
                                            Lead Times Spatial Performance
                                        </Box>


                                        <Filter
                                            values={TemperateExtent}
                                            setValues={handleSetTemperateExtent}
                                            multiSelect={true}
                                            labels={{ northtemperate: 'North Temperate', southtemperate: 'South Temperate' }}

                                        />

                                    </Row>
                                )
                            } else {
                                return (


                                    <Box
                                        sx={{
                                            ...sx.heading,
                                            textTransform: 'uppercase',
                                            fontSize: [2],
                                            color: '#45DFB1', // color: 'blue'
                                        }}
                                    >
                                        Lead Times Spatial Performance
                                    </Box>
                                )
                            }
                        })()}
                    </TooltipWrapper>
                </Box>


                {/* Lead Time slider and Legend side by side */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between', // push children to opposite sides
                        width: '100%',
                        mt: 2,
                        mb: 2,
                        gap: 4,
                    }}
                >
                    <Box sx={{ flex: 1, minWidth: 0, mr: 4 }}>
                        <LeadTimesSlider
                            time={time}
                            setTime={setTime}
                            max={40}
                            delay={250}
                            pause='max'
                        />
                    </Box>
                    <Box sx={{ minWidth: 180, mr: 1 }}>
                        <Legend
                            selectedVariable={selectedVariable}
                            clim={clim}
                            setClim={setClim}
                            colormap={finalColormap}
                        />
                    </Box>
                </Box>
            </Box>

            <Row>

                {/* Left column: Mini Map filters */}
                <Column start={[1, 1]} width={[2]}>
                    <Box
                        sx={{
                            pt: 1,
                            pb: 1,

                        }}
                    >
                        {/* Filters */}

                        <Box
                            sx={{
                                pb: 1,
                            }}
                        >
                            <Box sx={{ transform: 'scale(0.90)', transformOrigin: 'top left', width: '111.11%' }}>
                                <Filter
                                    values={models}
                                    // labels={{ q: 'Specific humidity' }}
                                    setValues={(newModels) => {
                                        setModel(newModels)
                                        const selected = Object.keys(newModels).find(key => newModels[key])
                                        if (selected) setSelectedModel(selected)
                                    }}
                                    multiSelect={false}
                                    labels={{ ECMWFAIFS: 'ecmwf-aifs', ECMWFIFS: 'ecmwf-ifs', GraphCast: 'graphcast' }}
                                />
                            </Box>
                        </Box>



                        <Box
                            sx={{
                                pb: 1,
                            }}
                        >
                            <Box sx={{ transform: 'scale(0.90)', transformOrigin: 'top left', width: '111.11%' }}>
                                <Filter
                                    values={variables}
                                    setValues={(newVariable) => {
                                        // highlight the selected variable
                                        setVariables(newVariable)
                                        //Call handleVariableChange when the filter changes
                                        const selectedVariable = Object.keys(newVariable).find(key => newVariable[key]);
                                        if (selectedVariable) {
                                            handleVariableChange({ target: { value: selectedVariable } })
                                        }
                                    }}
                                    multiSelect={false}
                                />
                            </Box>
                        </Box>
                        <Box sx={{ transform: 'scale(0.90)', transformOrigin: 'top left', width: '111.11%' }}>
                            <Filter
                                values={metrics}
                                setValues={(newMetrics) => {
                                    setMetrics(newMetrics)
                                    const selected = Object.keys(newMetrics).find(key => newMetrics[key])
                                    if (selected) setSelectedMetric(selected)
                                }}
                                multiSelect={false}
                            />
                        </Box>

                    </Box>
                </Column>



                {/* Right column: Minimap */}
                <Column start={[3]} width={[10]}>
                    <Box
                        sx={{
                            position: 'relative',

                            //  color: 'primary',

                            pb: 30
                        }}
                    >
                        {/* Spinner overlay */}
                        {loading && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '45%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 100,
                                    backgroundColor: 'transparent',
                                    borderRadius: 0,
                                    p: 0,
                                }}
                            >
                                <Spinner size={32} />
                            </Box>
                        )}

                        <Minimap projection={naturalEarth1}
                            {...(region !== 'africa' ? {
                                scale:
                                    1

                            } : { scale: 2 })}

                            translate={[0, 0]} >

                            <Path
                                stroke={theme.colors.primary}
                                source={'https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json'}
                                feature={'land'}
                            />

                            <Graticule stroke={theme.colors.primary} />
                            <Sphere fill={theme.colors.background} />


                            <Raster
                                clim={clim}
                                mode={'lut'}
                                nullValue={FILL_VALUE}
                                source={data}
                                colormap={finalColormap}
                                bounds={{
                                    lat:
                                        region === 'tropics' &&
                                            selectedExtent.includes('subtropics') &&
                                            (selectedExtent.length === 1 || selectedExtent.includes('tropics'))
                                            ? [-35, 35]
                                            : region === 'temperate' &&
                                                selectedTemperateExtent.length === 1 &&
                                                selectedTemperateExtent.includes('southtemperate')
                                                ? [-60, -35]
                                                : region === 'temperate' &&
                                                    selectedTemperateExtent.length === 1 &&
                                                    selectedTemperateExtent.includes('northtemperate')
                                                    ? [35, 60]
                                                    : [LAT_MIN, LAT_MAX],
                                    lon: [-180, 180],
                                }}
                            />


                        </Minimap>

                    </Box>
                </Column >
            </Row >
        </>




    )
}

export default LeadTimesMap


/*

const getCustomProjection = () => {
    return {
        ...naturalEarth1(),
        glsl: {
            func: `
      vec2 naturalEarth1Invert(float x, float y)
      {
        const float pi = 3.14159265358979323846264;
        const float halfPi = pi * 0.5;
        float phi = y;
        float delta;
        float phi2 = phi * phi;
        float phi4 = phi2 * phi2;
        for (int i = 0; i < 25; i++) {
          phi2 = phi * phi;
          phi4 = phi2 * phi2;
          delta = (phi * (1.007226 + phi2 * (0.015085 + phi4 * (-0.044475 + 0.028874 * phi2 - 0.005916 * phi4))) - y) / (1.007226 + phi2 * (0.015085 * 3.0 + phi4 * (-0.044475 * 7.0 + 0.028874 * 9.0 * phi2 - 0.005916 * 11.0 * phi4)));
          phi = phi - delta;
          if (abs(delta) < 1e-6) {
            break;
          }
        }
        phi2 = phi * phi;
        float lambda = x / (0.8707 + phi2 * (-0.131979 + phi2 * (-0.013791 + phi2 * phi2 * phi2 * (0.003971 - 0.001529 * phi2))));
        if (lambda <= -1.0 * pi + 1e-6 || lambda >= pi - 1e-6) {
          return vec2(-1000.0, -1000.0);
        } else {
          return vec2(degrees(lambda), degrees(phi));
        }
      }
    `,
            name: 'naturalEarth1Invert',
        },
    }
}
    */



/*
if (props.region === 'africa') {
                // Find latitude indices for Africa
                const latStart = latitudes.findIndex(lat => lat >= -35)
                let latEnd = latitudes.findIndex(lat => lat > 35)
                if (latEnd === -1) latEnd = latitudes.length

                // Generate longitude array (assuming regular grid)
                const nLon = chunks.shape[2]
                const nLat = chunks.shape[1]
                const longitudes = Array.from({ length: nLon }, (_, i) => -180 + i * (360 / nLon))

                // Find longitude indices for Africa
                const lonStart = longitudes.findIndex(lon => lon >= -20)
                let lonEnd = longitudes.findIndex(lon => lon > 55)
                if (lonEnd === -1) lonEnd = nLon

                // Pick the time slice
                const picked = chunks.pick(time, null, null)

                // Create a full array filled with FILL_VALUE
                const full = ndarray(
                    new picked.data.constructor(nLat * nLon),
                    [nLat, nLon]
                )
                ops.assigns(full, FILL_VALUE)

                // Copy Africa region data into the mask
                for (let i = latStart; i < latEnd; ++i) {
                    for (let j = lonStart; j < lonEnd; ++j) {
                        full.set(i, j, picked.get(i, j))
                    }
                }

                return full
            }








            <Row sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 3, // optional spacing between boxes
                    }}
                    >
                     <Box
                            sx={{
                                ...sx.heading,
                                //   fontFamily: 'mono',
                                textTransform: 'uppercase',
                                color: 'blue',

                            }}>
                            Lead Times Spatial Performance

                        </Box>

                        <Box
                            sx={{
                                ...sx.heading,
                                //   fontFamily: 'mono',
                                textTransform: 'uppercase',
                                color: 'blue',

                            }}>
                            Lead Times Spatial Performance

                        </Box>
                    </Row>

            */
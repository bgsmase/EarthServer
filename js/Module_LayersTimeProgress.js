//Namespace
var EarthServerGenericClient = EarthServerGenericClient || {};

/**
 * @class Scene Model: Layer and Time. TODO: Add better description
 * 1 URL for the service, 1 Coverage name data.
 * @augments EarthServerGenericClient.AbstractSceneModel
 */
EarthServerGenericClient.Model_LayersTimeProgress = function()
{
    this.setDefaults();
    this.name = "Coverage with layers and time progress.";

    /**
     * The custom or default WCPS Queries.
     * @type {Array}
     */
    this.WCPSQuery  = [];

    /**
     * Queried Layers.
     * @type {String}
     */
    this.queriedLayers = [];

    /**
     * Queried Hours.
     * @type {String}
     */
    this.queriedHours = [];

    /**
     * Number of already queried patches (layers of one hour).
     * @type {number}
     */
    this.queriedPatches = 0;
};
EarthServerGenericClient.Model_LayersTimeProgress.inheritsFrom( EarthServerGenericClient.AbstractSceneModel );

/**
 * Sets the URL for the service.
 * @param url
 */
EarthServerGenericClient.Model_LayersTimeProgress.prototype.setURL=function(url){
    /**
     * URL for the WCPS service.
     * @type {String}
     */
    this.URLWCPS = String(url);
};
/**
 * Sets the coverage name.
 * @param coverageLayer - Coverage name for the layered data set.
 */
EarthServerGenericClient.Model_LayersTimeProgress.prototype.setCoverage = function (coverageLayer) {
    /**
     * Name of the image coverage.
     * @type {String}
     */
    this.coverageLayer = String(coverageLayer);
};
/**
 * Sets the queried layers. E.g. 1:3
 * @param Layers
 */
EarthServerGenericClient.Model_LayersTimeProgress.prototype.setLayers = function (Layers)
{
    var tmpLayers = String(Layers);
    tmpLayers = tmpLayers.split(":");

    if( tmpLayers.length === 1)
    {   this.queriedLayers = tmpLayers; }
    else
    {
        for(var i=parseInt(tmpLayers[0]);i<=parseInt(tmpLayers[1]);i++)
        {   this.queriedLayers.push(i);  }
    }

    this.requests = this.queriedLayers.length * this.queriedHours.length;
};
/**
 * Sets the coverage time.
 * @param coverageTime
 */
EarthServerGenericClient.Model_LayersTimeProgress.prototype.setCoverageTime = function (coverageTime) {
    /**
     *
     * @type {String}
     */
    this.coverageTime = String(coverageTime);
};

/**
 * Sets the requested coverage hours (number of textures to load per level).
 * @param hours - E.g. 1:6
 */
EarthServerGenericClient.Model_LayersTimeProgress.prototype.setCoverageHours = function( hours )
{
    var tmpHours = String(hours);
    tmpHours = tmpHours.split(":");

    if( tmpHours.length === 1)
    {   this.queriedHours = tmpHours; }
    else
    {
        for(var i=parseInt(tmpHours[0]);i<=parseInt(tmpHours[1]);i++)
        {   this.queriedHours.push(i);  }
    }

    this.requests = this.queriedLayers.length * this.queriedHours.length;
};

/**
 * Sets a specific querystring for the data query.
 * @param queryString - the querystring. Use $CI (coverageImage), $CD (coverageDEM),
 * $MINX,$MINY,$MAXX,$MAXY(AoI) and $RESX,ResZ (Resolution) for automatic replacement.
 * Examples: $CI.red , x($MINX:$MINY)
 */
EarthServerGenericClient.Model_LayersTimeProgress.prototype.setWCPSForChannelALPHA = function(queryString)
{
    this.WCPSQuery = queryString;
};

/**
 * Sets the Coordinate Reference System.
 * @param value - eg. "http://www.opengis.net/def/crs/EPSG/0/27700"
 */
EarthServerGenericClient.Model_LayersTimeProgress.prototype.setCoordinateReferenceSystem = function(value)
{
    this.CRS = value;
};

/**
 * Creates the x3d geometry and appends it to the given root node. This is done automatically by the SceneManager.
 * @param root - X3D node to append the model.
 * @param cubeSizeX - Size of the fishtank/cube on the x-axis.
 * @param cubeSizeY - Size of the fishtank/cube on the y-axis.
 * @param cubeSizeZ - Size of the fishtank/cube on the z-axis.
 */
EarthServerGenericClient.Model_LayersTimeProgress.prototype.createModel=function(root, cubeSizeX, cubeSizeY, cubeSizeZ){
    if( root === undefined)
        alert("root is not defined");

    EarthServerGenericClient.MainScene.timeLogStart("Create Model " + this.name);

    this.cubeSizeX = cubeSizeX;
    this.cubeSizeY = cubeSizeY;
    this.cubeSizeZ = cubeSizeZ;

    this.root = root;

    // Check if mandatory values are set
    if( this.coverageLayer === undefined || this.URLWCPS === undefined ||
        this.coverageTime === undefined || this.queriedLayers === undefined || this.queriedHours === undefined  )
    {
        alert("Not all mandatory values are set. LayerAndTime: " + this.name );
        console.log(this);
        return;
    }

    // build query patch ( first hour )
    for(var i=0; i< this.queriedLayers.length;i++)
    {
        var queryString  = "for data in (" + this.coverageLayer +")";
        queryString     += "return encode((data[t:"+ this.CRS + "(" + this.coverageTime +"),";
        queryString     += 'd4:'+ this.CRS +'('+ this.queriedLayers[i]+ ')]).'+ this.queriedHours[0] +',"png")';

        this.WCPSQuery.push( queryString );
    }

    this.queriedPatches++;

    // request data
    EarthServerGenericClient.requestWCPSImages(this,this.URLWCPS,this.WCPSQuery);
};
/**
 * This is a callback method as soon as the ServerRequest in createModel() has received it's data.
 * This is done automatically.
 * @param data - Received data array(!) from the ServerRequest.
 */
EarthServerGenericClient.Model_LayersTimeProgress.prototype.receiveData = function( data)
{
    var failedData = 0;
    for(var i=0;i<data.length;i++)
    {
        // TODO: delete only the one element and UI only if all failed.
        if( !this.checkReceivedData( data[i] ) )
            failedData++;
    }

    // if all data failed return
    if( failedData == data.length) return;

    // create transform
    if( this.transformNode === undefined || this.transformNode === null)
    {
        this.transformNode = this.createTransform(2,this.queriedLayers.length,2,0,0,0);
        this.root.appendChild(this.transformNode);
    }

    // create terrain
    if( this.terrain === undefined || this.terrain === null)
    {
        EarthServerGenericClient.MainScene.timeLogStart("Create Terrain " + this.name);
        this.terrain = new EarthServerGenericClient.TimeProgressTerrain(this.transformNode,data,this.index,this.queriedLayers.length,this.queriedHours.length);
        this.terrain.createTerrain();
        EarthServerGenericClient.MainScene.timeLogEnd("Create Terrain " + this.name);
    }
    else
    {
        this.terrain.addNextHour(data);
    }

    // create queries for next patch
    if( this.queriedPatches < this.queriedHours.length )
    {
        this.WCPSQuery = [];
        // request next patch
        for( i=0; i< this.queriedLayers.length;i++)
        {
            var queryString  = "for data in (" + this.coverageLayer +")";
            queryString     += "return encode((data[t:"+ this.CRS + "(" + this.coverageTime +"),";
            queryString     += 'd4:'+ this.CRS +'('+ this.queriedLayers[i]+ ')]).'+ this.queriedHours[this.queriedPatches] +',"png")';

            this.WCPSQuery.push( queryString );
        }

        this.queriedPatches++;

        // request data
        EarthServerGenericClient.requestWCPSImages(this,this.URLWCPS,this.WCPSQuery);
    }
};

EarthServerGenericClient.Model_LayersTimeProgress.prototype.updateHour = function(value)
{
    if( this.terrain )
    {
        this.terrain.updateUsedMaterial(value);
    }
    else
        console.log("EarthServerGenericClient.Model_LayersTimeProgress: No Terrain.")
};

/**
 * Every Scene Model creates it's own specific UI elements. This function is called automatically by the SceneManager.
 * @param element - The element where to append the specific UI elements for this model.
 */
EarthServerGenericClient.Model_LayersTimeProgress.prototype.setSpecificElement= function(element)
{
   EarthServerGenericClient.appendGenericSlider(element,"Hour_"+this.index,"Time",this.index,
                    0,this.queriedHours.length-1,0,EarthServerGenericClient.MainScene.updateModelHour);
};
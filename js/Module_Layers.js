//Namespace
var EarthServerGenericClient = EarthServerGenericClient || {};

/**
 * @class Scene Model: Layer and Time. TODO: Add better description
 * 1 URL for the service, 1 Coverage name data.
 * @augments EarthServerGenericClient.AbstractSceneModel
 */
EarthServerGenericClient.Model_Layers = function()
{
    this.setDefaults();
    this.name = "Coverage with layers and time.";
   
    /**
     * The custom or default WCPS Queries.
     * @type {Array}
     */
    this.WCPSQuery  = [];
    /**
     * Data modifier for the data query. Should be a number as a string.
     * @default: Empty String
     * @type {string}
     */
    this.dataModifier = "";
};
EarthServerGenericClient.Model_Layers.inheritsFrom( EarthServerGenericClient.AbstractSceneModel );

/**
 * Sets the URL for the service.
 * @param url
 */
EarthServerGenericClient.Model_Layers.prototype.setURL=function(url){
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
EarthServerGenericClient.Model_Layers.prototype.setCoverage = function (coverageLayer) {
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
EarthServerGenericClient.Model_Layers.prototype.setLayers = function (Layers) {
    /**
     * Queried Layers.
     * @type {String}
     */
    this.queriedLayers = [];

    var tmpLayers = String(Layers);
    tmpLayers = tmpLayers.split(":");

    if( tmpLayers.length === 1)
    {   this.queriedLayers = tmpLayers; }
    else
    {
        for(var i=parseInt(tmpLayers[0]);i<=parseInt(tmpLayers[1]);i++)
        {   this.queriedLayers.push(i);  }
    }

    this.requests = this.queriedLayers.length;
};
/**
 * Sets the coverage time.
 * @param coverageTime
 */
EarthServerGenericClient.Model_Layers.prototype.setCoverageTime = function (coverageTime) {
    /**
     *
     * @type {String}
     */
    this.coverageTime = String(coverageTime);
};

/**
 * Sets the data modifier to be multiplied with the data. Eg: 10000
 * @param modifier
 */
EarthServerGenericClient.Model_Layers.prototype.setDataModifier = function( modifier )
{
    this.dataModifier = String(modifier) + "*";
};

/**
 * Sets a specific querystring for the data query.
 * @param queryString - the querystring. Use $CI (coverageImage), $CD (coverageDEM),
 * $MINX,$MINY,$MAXX,$MAXY(AoI) and $RESX,ResZ (Resolution) for automatic replacement.
 * Examples: $CI.red , x($MINX:$MINY)
 */
EarthServerGenericClient.Model_Layers.prototype.setWCPSForChannelALPHA = function(queryString)
{
    this.WCPSQuery = queryString;
};

/**
 * Sets the Coordinate Reference System.
 * @param value - eg. "http://www.opengis.net/def/crs/EPSG/0/27700"
 */
EarthServerGenericClient.Model_Layers.prototype.setCoordinateReferenceSystem = function(value)
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
EarthServerGenericClient.Model_Layers.prototype.createModel=function(root, cubeSizeX, cubeSizeY, cubeSizeZ){
    if( root === undefined)
        alert("root is not defined");

    EarthServerGenericClient.MainScene.timeLogStart("Create Model " + this.name);

    this.cubeSizeX = cubeSizeX;
    this.cubeSizeY = cubeSizeY;
    this.cubeSizeZ = cubeSizeZ;

    this.root = root;

    // Check if mandatory values are set
    if( this.coverageLayer === undefined || this.URLWCPS === undefined ||
        this.coverageTime === undefined || this.queriedLayers === undefined  )
    {
        alert("Not all mandatory values are set. LayerAndTime: " + this.name );
        console.log(this);
        return;
    }

    //IF something is not defined use standard query.
    if( this.WCPSQuery.length === 0 )
    {
        for(var i=0; i< this.queriedLayers.length;i++)
        {
            this.WCPSQuery[i]  = "for data in (" + this.coverageLayer +")";
            this.WCPSQuery[i] += "return encode(("+ this.dataModifier +"data[t(" + this.coverageTime +"),";
            this.WCPSQuery[i] += 'd4('+ this.queriedLayers[i]+ ')]),"png")';
        }
    }
    else //ALL set so use custom query
    {
        this.replaceSymbolsInString(this.WCPSQuery);
    }

    // request data
    EarthServerGenericClient.requestWCPSImages(this,this.URLWCPS,this.WCPSQuery);
};
/**
 * This is a callback method as soon as the ServerRequest in createModel() has received it's data.
 * This is done automatically.
 * @param data - Received data array(!) from the ServerRequest.
 */
EarthServerGenericClient.Model_Layers.prototype.receiveData = function( data)
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
    this.transformNode = this.createTransform(0,0,0,1,this.queriedLayers.length - 1,1);
    this.createTransform(2,this.queriedLayers.length,2,0,0,0);
    this.root.appendChild(this.transformNode);

    // create terrain
    EarthServerGenericClient.MainScene.timeLogStart("Create Terrain " + this.name);
    this.terrain = new EarthServerGenericClient.VolumeTerrain(this.transformNode,data,this.index,this.noDataValue);
    EarthServerGenericClient.MainScene.timeLogEnd("Create Terrain " + this.name);

};

EarthServerGenericClient.Model_Layers.prototype.updateMaxShownElements = function(value)
{
    if( this.terrain !== undefined )
        this.terrain.updateMaxShownElements(value);
};

/**
 * Every Scene Model creates it's own specific UI elements. This function is called automatically by the SceneManager.
 * @param element - The element where to append the specific UI elements for this model.
 */
EarthServerGenericClient.Model_Layers.prototype.setSpecificElement= function(element)
{
    EarthServerGenericClient.appendMaxShownElementsSlider(element,this.index,this.requests);
};
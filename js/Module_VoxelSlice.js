//Namespace
var EarthServerGenericClient = EarthServerGenericClient || {};

/**
 * @class Scene Model: VoxelSlice
 * 1 URL for the service, 1 Coverage name data.
 * @augments EarthServerGenericClient.AbstractSceneModel
 */
EarthServerGenericClient.Model_VoxelSlice = function()
{
    this.setDefaults();
    this.name = "Voxel Coverage with displayed slices";
   
    /**
     * The custom or default WCPS Queries.
     * @type {Array}
     */
    this.WCPSQuery  = [];
};
EarthServerGenericClient.Model_VoxelSlice.inheritsFrom( EarthServerGenericClient.AbstractSceneModel );

/**
 * Sets the URL for the service.
 * @param url
 */
EarthServerGenericClient.Model_VoxelSlice.prototype.setURL=function(url){
    /**
     * URL for the WCPS service.
     * @type {String}
     */
    this.URLWCPS = String(url);
};
/**
 * Sets the coverage name.
 * @param coverageVoxel - Coverage name for the layered data set.
 */
EarthServerGenericClient.Model_VoxelSlice.prototype.setCoverage = function (coverageVoxel) {
    /**
     * Name of the voxel coverage.
     * @type {String}
     */
    this.coverageVoxel = String(coverageVoxel);
};
/**
 * Sets the slice positions
 * @param slices
 */
EarthServerGenericClient.Model_VoxelSlice.prototype.setSlices = function (slices) {
    /**
     * Queried slices.
     * @type {Array}
     */
    this.slices = slices;

    this.requests = this.slices.length;
};

/**
 * Specify the array of slice queries directly.
 * @param sliceQueries - the array of queries. Use $CI (coverageImage),
 * $MINX,$MINY,$MAXX,$MAXY(AoI) and $RESX,RESZ (Resolution) for automatic replacement.
 * Examples: $CI.red , x($MINX:$MINY)
 */
EarthServerGenericClient.Model_VoxelSlice.prototype.setWCPSSliceQueries = function(sliceQueries)
{
    this.WCPSQuery = sliceQueries;
};

/**
 * Sets the Coordinate Reference System.
 * @param value - eg. "http://www.opengis.net/def/crs/EPSG/0/27700"
 */
EarthServerGenericClient.Model_VoxelSlice.prototype.setCoordinateReferenceSystem = function(value)
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
EarthServerGenericClient.Model_VoxelSlice.prototype.createModel=function(root, cubeSizeX, cubeSizeY, cubeSizeZ){
    if( root === undefined)
        alert("root is not defined");

    EarthServerGenericClient.MainScene.timeLogStart("Create Model " + this.name);

    this.cubeSizeX = cubeSizeX;
    this.cubeSizeY = cubeSizeY;
    this.cubeSizeZ = cubeSizeZ;

    this.root = root;

    // Check if mandatory values are set
    if( this.coverageVoxel === undefined || this.URLWCPS === undefined ||
        this.slices === undefined  )
    {
        alert("Not all mandatory values are set. VoxelSlice: " + this.name );
        console.log(this);
        return;
    }

    //IF something is not defined use standard query.
    if( this.WCPSQuery.length === 0 )
    {
        for(var i=0; i< this.slices.length;i++)
        {
            this.WCPSQuery[i]  = "for data in (" + this.coverageVoxel +")";
            this.WCPSQuery[i] += "return encode(slice( data, Height(" + this.slices[i]+ ')),"png", "nodata=0")';
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
EarthServerGenericClient.Model_VoxelSlice.prototype.receiveData = function( data)
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
    // Later if YMinimum and YResolution not set then should check min and max of slice values.
    YMinimum = this.YMinimum;
    YResolution = this.YResolution;
    this.transformNode = this.createTransform(0,YMinimum,0,1,YMinimum + YResolution,1);
    this.root.appendChild(this.transformNode);

    // create terrain
    EarthServerGenericClient.MainScene.timeLogStart("Create Terrain " + this.name);
    this.terrain = new EarthServerGenericClient.VolumeSliceTerrain(this.transformNode,data,this.slices,this.index,this.noDataValue);
    EarthServerGenericClient.MainScene.timeLogEnd("Create Terrain " + this.name);

};

EarthServerGenericClient.Model_VoxelSlice.prototype.updateMaxShownElements = function(value)
{
    if( this.terrain !== undefined )
        this.terrain.updateMaxShownElements(value);
};

/**
 * Every Scene Model creates it's own specific UI elements. This function is called automatically by the SceneManager.
 * @param element - The element where to append the specific UI elements for this model.
 */
EarthServerGenericClient.Model_VoxelSlice.prototype.setSpecificElement= function(element)
{
    EarthServerGenericClient.appendMaxShownElementsSlider(element,this.index,this.requests);
};
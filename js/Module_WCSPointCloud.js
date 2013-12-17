//Namespace
var EarthServerGenericClient = EarthServerGenericClient || {};

/**
 * @class Scene Model: WCS Point Cloud
 * 1 URL for the service, 1 Coverage name point cloud
 * @augments EarthServerGenericClient.AbstractSceneModel
 */
EarthServerGenericClient.Model_WCSPointCloud = function()
{
    this.setDefaults();
    this.name = "WCS Point Cloud";
    /**
     * WCS version for the query.
     * @default "2.0.0"
     * @type {String}
     */
    this.WCSVersion = "2.0.0";
    /**
     * Size of the drawn points.
     * @default 3.0
     * @type {number}
     */
    this.pointSize = 3.0;
};
EarthServerGenericClient.Model_WCSPointCloud.inheritsFrom( EarthServerGenericClient.AbstractSceneModel );

/**
 * Sets the URL for the service.
 * @param url
 */
EarthServerGenericClient.Model_WCSPointCloud.prototype.setURL=function(url){
    /**
     * URL for the WCS service.
     * @type {String}
     */
    this.URLWCS = String(url);
};
/**
 * Sets the WCS Version for the WCS Query String. Default: "2.0.0"
 * @param version - String with WCS version number.
 */
EarthServerGenericClient.Model_WCSPointCloud.prototype.setWCSVersion = function(version)
{
    this.WCSVersion = String(version);
};
/**
 * Sets the coverage name.
 * @param coveragePointCloud - Coverage name for the image data set.
 */
EarthServerGenericClient.Model_WCSPointCloud.prototype.setCoverage = function (coveragePointCloud)
{
    /**
     * Name of the point cloud coverage.
     * @type {String}
     */
    this.coveragePointCloud = String(coveragePointCloud);
};

/**
 * Sets the size of the points in the cloud.
 * @param pointSize - Size of the points in the cloud.
 */
EarthServerGenericClient.Model_WCSPointCloud.prototype.setPointSize = function (pointSize)
{
    /**
     * Size of the points in the cloud.
     * @type {String}
     */
    this.pointSize = pointSize;
};

/**
 * Creates the x3d geometry and appends it to the given root node. This is done automatically by the SceneManager.
 * @param root - X3D node to append the model.
 * @param cubeSizeX - Size of the fishtank/cube on the x-axis.
 * @param cubeSizeY - Size of the fishtank/cube on the y-axis.
 * @param cubeSizeZ - Size of the fishtank/cube on the z-axis.
 */
EarthServerGenericClient.Model_WCSPointCloud.prototype.createModel=function(root, cubeSizeX, cubeSizeY, cubeSizeZ){
    if( root === undefined)
        alert("root is not defined");

    EarthServerGenericClient.MainScene.timeLogStart("Create Model " + this.name);

    this.cubeSizeX = cubeSizeX;
    this.cubeSizeY = cubeSizeY;
    this.cubeSizeZ = cubeSizeZ;

    this.root = root;

    //Create Placeholder
    this.createPlaceHolder();

    // Check if mandatory values are set
    if( this.coveragePointCloud === undefined || this.URLWCS === undefined || this.minh === undefined || this.maxh === undefined
        || this.minx === undefined || this.miny === undefined || this.maxx === undefined || this.maxy === undefined )
    {
        alert("Not all mandatory values are set. WCSPointCloud: " + this.name );
        console.log(this);
        return;
    }
    // Make ServerRequest and receive data.
    EarthServerGenericClient.requestWCSPointCloud(this,this.URLWCS,this.WCSVersion,this.coveragePointCloud,
                    this.minx,this.maxx,this.miny,this.maxy,this.minh,this.maxh);
};

/**
 * Updates the size of points for this model.
 * @param value - Point size
 */
EarthServerGenericClient.Model_WCSPointCloud.prototype.updatePointSize = function(value)
{
    if( this.terrain )
        this.terrain.setPointSize(value);
};

/**
 * This is a callback method as soon as the ServerRequest in createModel() has received it's data.
 * This is done automatically.
 * @param data - Received data from the ServerRequest.
 */
EarthServerGenericClient.Model_WCSPointCloud.prototype.receiveData = function( data)
{
    if( this.checkReceivedData(data))
    {
        //If progressive loading is enabled this function is called multiple times.
        //The lower resolution version shall be removed and replaced with the new one.
        //So the old transformNode will be removed and a new one created.
        if(this.transformNode !== undefined )
        {   this.root.removeChild(this.transformNode); }

        //In the first receiveData call remove the placeholder.
        this.removePlaceHolder();

        var YResolution = this.YResolution || (parseFloat(data.maxHMvalue) - parseFloat(data.minHMvalue) );

        // build transform
        this.transformNode = this.createTransform(data.width,YResolution,data.height,data.minHMvalue,data.minXvalue,data.minZvalue);
        /*this.transformNode = document.createElement("transform");
        this.transformNode.setAttribute("id", "EarthServerGenericClient_modelTransform"+this.index);
        this.transformNode.setAttribute("onclick","EarthServerGenericClient.MainScene.OnClickFunction("+this.index+",event.hitPnt);");

        var scaleX = (this.cubeSizeX*this.xScale)/(data.width);
        var scaleY = (this.cubeSizeY*this.yScale)/ YResolution;
        var scaleZ = (this.cubeSizeZ*this.zScale)/(data.height);
        this.transformNode.setAttribute("scale", "" + scaleX + " " + scaleY + " " + scaleZ);

        var xoff = (this.cubeSizeX * this.xOffset) - (this.cubeSizeX/2.0) - (scaleX * data.minXvalue);
        var yoff = (this.cubeSizeY * this.yOffset) - (data.minHMvalue*scaleY) - (this.cubeSizeY/2.0);
        var zoff = (this.cubeSizeZ * this.zOffset) - (this.cubeSizeZ/2.0) - (scaleZ * data.minZvalue);
        this.transformNode.setAttribute("translation", "" + xoff+ " " + yoff  + " " + zoff);*/
        this.root.appendChild(this.transformNode);

        // create point cloud terrain
        this.terrain = new EarthServerGenericClient.PointCloudTerrain(this.transformNode,data,this.index,this.pointSize);
        this.terrain.createTerrain();
    }
};

/**
 * Every Scene Model creates it's own specific UI elements. This function is called automatically by the SceneManager.
 * @param element - The element where to append the specific UI elements for this model.
 */
EarthServerGenericClient.Model_WCSPointCloud.prototype.setSpecificElement= function(element)
{
    // change point size
    var id = "EarthServerGenericClient_SliderCell_ps_"+this.index;
    EarthServerGenericClient.appendGenericSlider(element,id,"Point Size",this.index,1,20,this.pointSize, EarthServerGenericClient.MainScene.updatePointSize);
};
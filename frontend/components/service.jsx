import React from 'react';
import {sendService} from '../util/service';

class Service extends React.Component {
	
	sendService(){
		const imgData = document.querySelector('#c').toDataURL('image/jpeg', 1.0);
		const data = imgData.replace(/^data:image\/\w+;base64,/, "");
		console.log(data);
		const requestData = {
	          "sysparm_action": "insert",
	          "category": $("#cat-select").val(),
	          "state": $("#state-select").val(),
	          "impact":$("#impact-select").val(),
	          "urgency":$("#urgency-select").val(),
	          "short_description":$('#input-level').val(),
	          "cmdb_ci": "email",
	          "caller_id":"admin",
	          "assignment_group":$("#ag-select").val(),
	          "assigned_to":$("#at-select").val(),
	        };
    console.log(requestData.caller_id);
    sendService(requestData).then(data => {
    	const obj = JSON.parse(data);
      console.log(obj.records[0].number);
      alert("Incident Number ====>"+obj.records[0].number);
    });
	}

	render(){
		return(
		<div id="table_left" >
			{/*style={{'position': 'fixed', 'right': '0', 'top': '100px'}}*/}
	    <table id="table-1" className="table table-hover dataTable no-footer" cellSpacing="0" >
	      {/*style={{'borderRadius':'5px', 'backgroundColor':'#2F425E','color':'#FFFFFF'}}*/}
	      <tbody id='targetForRows'>
	        <tr className="normal">
	          <td colSpan="2">
	           <div className="title-bar-2">
	            <span id="cityName">Create Incident</span>
	            	{/*
	            	style={{'color':'#FFFFFF','paddingLeft':'30px'}}>
	            	*/}
	           </div>
	          </td>
	        </tr>
	        <tr className="wv-pl">
	          <td>
	            <span>Category</span>
	            <select id="cat-select" className="input">
	              <option>Select a Category</option>
	                <option value="Inquiry/help">Inquiry / Help</option>
	              <option value="hardware">Hardware</option>
	              <option value="software">Software</option>
	              <option value="database">Database</option>
	              <option value="network">Network</option>
	            </select>
	          </td>
	        </tr>
	          <tr className="wv-pl">
		          <td>
		            <span>State</span>
		            <select id="state-select" className="input">
		              <option value="1">New</option>
		              <option value="2">In Progress</option>
		              <option value="3">On Hold</option>
		              <option value="6">Resolved</option>
		            <option value="7">Closed</option>
		            </select>
		          </td>
	        	</tr>
	          <tr className="wv-pl">
	          <td>
	            <span>Impact</span>
	            <select id="impact-select" className="input">
	              <option value="1">High</option>
	              <option value="2">Medium</option>
	              <option value="3">Low</option>
	            </select>
	          </td>
	        </tr>
	          <tr className="wv-pl">
	          <td>
	            <span>Urgency</span>
	            <select id="urgency-select" className="input">
	              <option value="1">High</option>
	              <option value="2">Medium</option>
	              <option value="3">Low</option>
	            </select>
	          </td>
	        </tr>
	        <tr className="wv-pl">
	          <td>
	            <span>Short Description</span>
	            <input id="input-level" type="text" name="conc"/>
	          </td>
	        </tr>
	           <tr className="wv-pl">
	          <td>
	            <span>Assignment Group</span>
	            <select id="ag-select" className="input">
	              <option>Select a AG</option>
	              <option value="CAB Approval">CAB Approval</option>
	              <option value="Database">Database</option>
	              <option value="Network">Network</option>
	              <option value="Hardware">Hardware</option>
	             <option value="Software">Software</option>
	            </select>
	          </td>
	        </tr>
	          <tr className="wv-pl">
	          <td>
	            <span>Assigned To</span>
	            <select id="at-select" className="input">
	              <option>Select a AT</option>
	              <option value="Pavan Karra">Pavan Karra</option>
	            </select>
	          </td>
	        </tr>
	        <tr className="wv-pl">
		        <td>
							<div className='send-service-button'>
								{/*
									style={{'margin':'20px 0 0 70px', 'height':'100px'}}
								*/}
		            <button onClick={()=>this.sendService()} name="fname">Create</button>
							</div>
		        </td>
          </tr>
	      </tbody>
	    </table>
	 </div>
		)
	}
}

export default Service;
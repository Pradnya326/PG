// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract Employee {
    address public admin;
    uint public total;
    struct Employee{
        string name;
        string email;
        string phone;
        uint salary;
        string role;
        address eadd;       
    }

    mapping(uint =>Employee) public empInfo;//id=>employee
    mapping(address => string) public roles;//address=>role
    
    constructor () public{
        admin = msg.sender;
    }

    function addEmployee(string memory _n, string memory _e, string memory _p, uint _s, string memory _r) public {
        total++;
        empInfo[total] = Employee(_n,_e,_p,_s,_r,msg.sender);
        empInfo[total].eadd = msg.sender;
        roles[msg.sender] = _r;
    }

    function updateSalary(uint _id, uint _salary) public{
        empInfo[_id].salary = _salary;
    }
}
